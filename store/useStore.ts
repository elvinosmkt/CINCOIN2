import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '../types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      theme: 'dark', // Default to dark mode for crypto vibes
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    }),
    {
      name: 'cincoin-storage',
    }
  )
);