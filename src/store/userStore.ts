import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: string | null;
  setUser: (name: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (name: string) => set({ user: name }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);