import { createClient } from '@libsql/client';

const client = createClient({
  url: 'file:local.db',
});

export async function initializeDatabase() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      total_price REAL NOT NULL,
      installments INTEGER NOT NULL,
      date TEXT NOT NULL
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      installment_number INTEGER NOT NULL,
      date TEXT NOT NULL,
      amount REAL NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);
}

export { client };