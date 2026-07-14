import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/db';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('kasir_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (username: string, password: string) => {
    const found = await db.users.where('username').equals(username).first();
    if (found && found.password === password && found.isActive) {
      setUser(found);
      localStorage.setItem('kasir_user', JSON.stringify(found));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kasir_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
