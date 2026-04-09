export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
  type: 'SERVICE' | 'PRODUCT';
}

export interface Client {
  id: string;
  name: string;
  contact: string;
  address?: string;
  gender?: 'MALE' | 'FEMALE';
  isNew?: boolean;
  notes?: string;
}

export interface SaleItem {
  id: string;
  serviceId: string;
  name: string;
  price: number;
  quantity: number;
  type: 'SERVICE' | 'PRODUCT';
}

export type PaymentMethod = 'CASH' | 'CARD';

export interface Sale {
  id: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  clientName: string;
  timestamp: number;
}

export interface Staff {
  id: string;
  staffId: string;
  name: string;
  contact: string;
}

export interface Product {
  id: string;
  productId: string;
  barcodeId: string;
  brand: string;
  name: string;
  price: number;
  stock: number;
}

export interface Appointment {
  id: string;
  staffId: string;
  clientName: string;
  serviceName: string;
  time: string;
  date: string;
  duration: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}