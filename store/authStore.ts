import { create } from 'zustand';
import { UserRole } from '@/types';

interface AuthState {
  uid: string | null;
  email: string | null;
  role: UserRole | null;
  isLoading: boolean;
  setUser: (uid: string, email: string, role: UserRole) => void;
  setLoading: (val: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  uid: null,
  email: null,
  role: null,
  isLoading: false,
  setUser: (uid, email, role) => set({ uid, email, role }),
  setLoading: (val) => set({ isLoading: val }),
  logout: () => set({ uid: null, email: null, role: null }),
}));
