import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens } from '../types/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (tokens: AuthTokens, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setTokens: (tokens: Partial<AuthTokens>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (tokens, user) => set({
        user,
        accessToken: tokens.access,
        refreshToken: tokens.refresh,
        isAuthenticated: true,
      }),
      logout: () => set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      }),
      setUser: (user) => set({ user }),
      setTokens: (tokens) => set((state) => ({
        accessToken: tokens.access ?? state.accessToken,
        refreshToken: tokens.refresh ?? state.refreshToken,
        isAuthenticated: !!(tokens.access ?? state.accessToken)
      })),
    }),
    {
      name: 'dishplan-auth',
    }
  )
);
