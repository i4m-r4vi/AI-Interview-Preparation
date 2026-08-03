'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';
import { authApi } from '@/lib/api';
import {
  getToken,
  setToken,
  setStoredUser,
  getStoredUser,
  clearAuth,
} from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = getToken();
      const stored = getStoredUser();
      if (token && stored) {
        setUser(stored);
        try {
          const { data } = await authApi.me();
          setUser(data.data);
          setStoredUser(data.data);
        } catch {
          clearAuth();
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login({ email, password });
    setToken(data.data.token);
    setStoredUser(data.data.user);
    setUser(data.data.user);
    return data.data.user;
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await authApi.register({ name, email, password });
    setToken(data.data.token);
    setStoredUser(data.data.user);
    setUser(data.data.user);
    return data.data.user;
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
