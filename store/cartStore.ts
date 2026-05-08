import { create } from 'zustand';
import { OrderItem, OrderType } from '@/types';

interface CartState {
  items: OrderItem[];
  tableId: string | null;
  tableNumber: number | null;
  orderType: OrderType;
  addItem: (item: OrderItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  setTable: (tableId: string, tableNumber: number) => void;
  setOrderType: (type: OrderType) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  tableId: null,
  tableNumber: null,
  orderType: 'dine_in',
  addItem: (item) => {
    const existing = get().items.find(i => i.id === item.id);
    if (existing) {
      set({ items: get().items.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) });
    } else {
      set({ items: [...get().items, { ...item, qty: 1 }] });
    }
  },
  removeItem: (id) => set({ items: get().items.filter(i => i.id !== id) }),
  updateQty: (id, qty) => {
    if (qty <= 0) {
      set({ items: get().items.filter(i => i.id !== id) });
    } else {
      set({ items: get().items.map(i => i.id === id ? { ...i, qty } : i) });
    }
  },
  setTable: (tableId, tableNumber) => set({ tableId, tableNumber }),
  setOrderType: (type) => set({ orderType: type }),
  clearCart: () => set({ items: [], tableId: null, tableNumber: null }),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
}));
