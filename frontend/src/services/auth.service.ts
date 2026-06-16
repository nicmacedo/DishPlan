import { api } from '../lib/axios';
import type { AuthTokens, User, RegisterPayload, GoogleLoginResponse } from '../types/auth';

export const AuthService = {
  login: async (credentials: { email: string; password: string }): Promise<AuthTokens> => {
    const response = await api.post('/api/auth/login/', credentials);
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<void> => {
    await api.post('/api/auth/register/', payload);
  },

  // O endpoint retorna {access, refresh, user} quando JWT_AUTH_HTTPONLY=False
  googleLogin: async (code: string): Promise<GoogleLoginResponse> => {
    const response = await api.post('/api/auth/social/google/', { code });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout/');
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/api/auth/user/');
    return response.data;
  },
};
