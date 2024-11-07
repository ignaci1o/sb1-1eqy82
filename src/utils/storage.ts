import { Product, Payment } from '../types';
import { client, initializeDatabase } from './db';

class SQLStorage {
  private initialized: boolean = false;

  private async ensureInitialized() {
    if (!this.initialized) {
      await initializeDatabase();
      this.initialized = true;
    }
  }

  async save(products: Product[]) {
    try {
      await this.ensureInitialized();

      await client.execute('BEGIN TRANSACTION');

      try {
        // Clear existing data
        await client.execute('DELETE FROM payments');
        await client.execute('DELETE FROM products');

        // Insert products
        for (const product of products) {
          await client.execute({
            sql: `
              INSERT INTO products (id, name, total_price, installments, date)
              VALUES (?, ?, ?, ?, ?)
            `,
            args: [
              product.id,
              product.name,
              product.totalPrice,
              product.installments,
              product.date.toISOString()
            ]
          });

          // Insert payments for this product
          for (const payment of product.payments) {
            await client.execute({
              sql: `
                INSERT INTO payments (product_id, installment_number, date, amount)
                VALUES (?, ?, ?, ?)
              `,
              args: [
                product.id,
                payment.installmentNumber,
                payment.date.toISOString(),
                payment.amount
              ]
            });
          }
        }

        await client.execute('COMMIT');
      } catch (error) {
        await client.execute('ROLLBACK');
        throw error;
      }
    } catch (error) {
      console.error('Error saving products:', error);
    }
  }

  async load(): Promise<Product[]> {
    try {
      await this.ensureInitialized();

      const productsResult = await client.execute('SELECT * FROM products');
      const products: Product[] = [];

      for (const row of productsResult.rows) {
        const paymentsResult = await client.execute({
          sql: 'SELECT * FROM payments WHERE product_id = ?',
          args: [row.id]
        });

        const payments: Payment[] = paymentsResult.rows.map(payment => ({
          installmentNumber: payment.installment_number as number,
          date: new Date(payment.date as string),
          amount: payment.amount as number
        }));

        products.push({
          id: row.id as string,
          name: row.name as string,
          totalPrice: row.total_price as number,
          installments: row.installments as number,
          date: new Date(row.date as string),
          payments
        });
      }

      return products;
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  }
}

export const storage = new SQLStorage();