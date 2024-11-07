import React, { useState, useEffect } from 'react';
import { PlusCircle, Receipt, Wallet } from 'lucide-react';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { PaymentSummary } from './components/PaymentSummary';
import { Product } from './types';
import { storage } from './utils/storage';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const savedProducts = await storage.load();
      setProducts(savedProducts);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      storage.save(products);
    }
  }, [products, isLoading]);

  const addProduct = (product: Omit<Product, 'id' | 'payments'>) => {
    setProducts([...products, {
      ...product,
      id: uuidv4(),
      payments: []
    }]);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handlePayInstallment = (productId: string, installmentNumber: number) => {
    setProducts(products.map(product => {
      if (product.id !== productId) return product;

      const isAlreadyPaid = product.payments.some(
        p => p.installmentNumber === installmentNumber
      );

      if (isAlreadyPaid) {
        return {
          ...product,
          payments: product.payments.filter(
            p => p.installmentNumber !== installmentNumber
          )
        };
      }

      return {
        ...product,
        payments: [
          ...product.payments,
          {
            installmentNumber,
            date: new Date(),
            amount: product.totalPrice / product.installments
          }
        ]
      };
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Calculadora de Cuotas
          </h1>
          <p className="text-gray-600">
            Gestiona tus compras en cuotas de manera simple
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <PlusCircle className="text-indigo-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Agregar Producto
              </h2>
            </div>
            <ProductForm onSubmit={addProduct} />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Receipt className="text-indigo-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Productos
              </h2>
            </div>
            <ProductList 
              products={products} 
              onRemove={removeProduct}
              onPayInstallment={handlePayInstallment}
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Wallet className="text-indigo-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Resumen de Pagos
              </h2>
            </div>
            <PaymentSummary products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;