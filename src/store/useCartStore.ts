import { create } from 'zustand';
import { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  tableId: string | null;
  tableNumber: number | null;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  setTable: (tableId: string, tableNumber: number) => void;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  tableId: null,
  tableNumber: null,
  addItem: (item) => {
    const existing = get().items.find((i) => i.id === item.id);
    if (existing) {
      set({ items: get().items.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) });
    } else {
      set({ items: [...get().items, { ...item, qty: 1 }] });
    }
  },
  removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
  updateQty: (id, qty) => {
    if (qty <= 0) {
      set({ items: get().items.filter((i) => i.id !== id) });
    } else {
      set({ items: get().items.map((i) => i.id === id ? { ...i, qty } : i) });
    }
  },
  clearCart: () => set({ items: [], tableId: null, tableNumber: null }),
  setTable: (tableId, tableNumber) => set({ tableId, tableNumber }),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
}));
