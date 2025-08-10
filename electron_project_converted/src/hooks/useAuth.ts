import { useState, useEffect } from 'react';
import { User, AuthState } from '../types';

const STORAGE_KEY = 'pos_auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAuthState(parsed);
      } catch (error) {
        console.error('Failed to parse stored auth:', error);
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Mock authentication - in production, this would call an API
    const users: User[] = [
      {
        id: '1',
        username: 'cashier1',
        role: 'cashier',
        name: 'John Doe',
        email: 'john@store.com',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        username: 'manager1',
        role: 'manager',
        name: 'Jane Smith',
        email: 'jane@store.com',
        createdAt: new Date().toISOString(),
      },
    ];

    const user = users.find(u => u.username === username);
    if (user && password === 'password123') {
      const newAuthState = { user, isAuthenticated: true };
      setAuthState(newAuthState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAuthState));
      return true;
    }
    return false;
  };

  const logout = () => {
    const newAuthState = { user: null, isAuthenticated: false };
    setAuthState(newAuthState);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    ...authState,
    login,
    logout,
  };
};