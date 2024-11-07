import React from 'react';
import { Product } from '../types';

interface PaymentSummaryProps {
  products: Product[];
}

export function PaymentSummary({ products }: PaymentSummaryProps) {
  const calculateMonthlyPayment = () => {
    return products.reduce((total, product) => {
      const paidInstallments = product.payments.length;
      const remainingInstallments = product.installments - paidInstallments;
      if (remainingInstallments <= 0) return total;
      return total + (product.totalPrice / product.installments);
    }, 0);
  };

  const calculateTotalDebt = () => {
    return products.reduce((total, product) => {
      const paidAmount = product.payments.reduce((sum, payment) => sum + payment.amount, 0);
      return total + (product.totalPrice - paidAmount);
    }, 0);
  };

  const calculateTotalPaid = () => {
    return products.reduce((total, product) => {
      return total + product.payments.reduce((sum, payment) => sum + payment.amount, 0);
    }, 0);
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalDebt = calculateTotalDebt();
  const totalPaid = calculateTotalPaid();

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-medium mb-2">Próximo Pago Mensual</h3>
        <p className="text-3xl font-bold">${monthlyPayment.toLocaleString()}</p>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-medium mb-2">Deuda Total</h3>
        <p className="text-3xl font-bold">${totalDebt.toLocaleString()}</p>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-medium mb-2">Total Pagado</h3>
        <p className="text-3xl font-bold">${totalPaid.toLocaleString()}</p>
      </div>
    </div>
  );
}