export type UserRole = 'admin' | 'kitchen' | 'customer';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: number;
}

export interface Table {
  id: string;
  number: number;
  roomName?: string;
  token: string;
  status: 'empty' | 'occupied' | 'unknown';
  isActive: boolean;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  isAvailable: boolean;
  createdAt: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export type OrderStatus = 'NEW' | 'COOKING' | 'READY' | 'DONE';
export type PaymentStatus = 'PENDING' | 'PAID' | 'CASH';
export type PaymentMethod = 'click' | 'payme' | 'uzum' | 'cash';
export type OrderType = 'dine_in' | 'takeaway';

export interface Order {
  id: string;
  tableId: string;
  tableNumber: number;
  items: CartItem[];
  total: number;
  type: OrderType;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  estimatedTime: number;
  timestamp: number;
  completedAt?: number;
}

export interface PaymentSettings {
  click: { enabled: boolean; merchantId: string };
  payme: { enabled: boolean; merchantId: string };
  uzum: { enabled: boolean; merchantId: string };
  cash: { enabled: boolean };
}

export interface RestaurantSettings {
  name: string;
  logo: string;
  workingHours: string;
  estimatedTime: number;
  currency: string;
  payments: PaymentSettings;
}
