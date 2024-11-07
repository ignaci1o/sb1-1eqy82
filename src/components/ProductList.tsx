import React from 'react';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Product, Payment } from '../types';

interface ProductListProps {
  products: Product[];
  onRemove: (index: number) => void;
  onPayInstallment: (productId: string, installmentNumber: number) => void;
}

export function ProductList({ products, onRemove, onPayInstallment }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No hay productos agregados
      </div>
    );
  }

  const getInstallmentStatus = (product: Product, installmentNumber: number) => {
    return product.payments.some(p => p.installmentNumber === installmentNumber);
  };

  return (
    <div className="space-y-6">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="bg-gray-50 rounded-lg overflow-hidden"
        >
          <div className="flex items-center justify-between p-4">
            <div>
              <h3 className="font-medium text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-600">
                ${product.totalPrice.toLocaleString()} en {product.installments} cuotas
              </p>
              <p className="text-sm text-gray-500">
                Cuota: ${(product.totalPrice / product.installments).toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700 transition-colors duration-200"
            >
              <Trash2 size={20} />
            </button>
          </div>
          
          <div className="border-t border-gray-200 p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Estado de Cuotas:</h4>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {Array.from({ length: product.installments }, (_, i) => (
                <button
                  key={i}
                  onClick={() => onPayInstallment(product.id, i + 1)}
                  className={`flex flex-col items-center p-2 rounded-md transition-colors duration-200 ${
                    getInstallmentStatus(product, i + 1)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xs mb-1">Cuota {i + 1}</span>
                  {getInstallmentStatus(product, i + 1) ? (
                    <CheckCircle size={16} />
                  ) : (
                    <XCircle size={16} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}