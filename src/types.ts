export interface Product {
  id: string;
  name: string;
  totalPrice: number;
  installments: number;
  date: Date;
  payments: Payment[];
}

export interface Payment {
  installmentNumber: number;
  date: Date;
  amount: number;
}

export interface ProductStorage {
  save: (products: Product[]) => void;
  load: () => Product[];
}