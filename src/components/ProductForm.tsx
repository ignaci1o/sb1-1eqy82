import React, { useState } from 'react';
import { Product } from '../types';

interface ProductFormProps {
  onSubmit: (product: Product) => void;
}

export function ProductForm({ onSubmit }: ProductFormProps) {
  const [name, setName] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [installments, setInstallments] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !totalPrice || !installments) return;

    onSubmit({
      name,
      totalPrice: parseFloat(totalPrice),
      installments: parseInt(installments),
      date: new Date(),
    });

    setName('');
    setTotalPrice('');
    setInstallments('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Producto
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 p-2"
          placeholder="Ej: Tostadora"
          required
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Precio Total
        </label>
        <div className="relative mt-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            $
          </span>
          <input
            type="number"
            id="price"
            value={totalPrice}
            onChange={(e) => setTotalPrice(e.target.value)}
            className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 p-2"
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="installments" className="block text-sm font-medium text-gray-700">
          Número de Cuotas
        </label>
        <input
          type="number"
          id="installments"
          value={installments}
          onChange={(e) => setInstallments(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 p-2"
          placeholder="Ej: 12"
          min="1"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
      >
        Agregar Producto
      </button>
    </form>
  );
}