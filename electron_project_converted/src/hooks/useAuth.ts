import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import { signIn, signUp, signOut, getUserData, initializeDemoData } from '../services/firebaseService';
import { User, AuthState } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userData = await getUserData(firebaseUser.uid);
          if (userData) {
            setAuthState({
              user: userData,
              isAuthenticated: true,
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setAuthState({
            user: null,
            isAuthenticated: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
        });
      }
      setLoading(false);
    });

    // Initialize demo data when the app starts
    initializeDemoData();

    return () => unsubscribe();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Demo user mapping
      const demoUsers = {
        'cashier1': {
          email: 'cashier1@store.com',
          userData: {
            username: 'cashier1',
            role: 'cashier' as const,
            name: 'John Doe',
            email: 'cashier1@store.com',
            createdAt: new Date().toISOString(),
          }
        },
        'manager1': {
          email: 'manager1@store.com',
          userData: {
            username: 'manager1',
            role: 'manager' as const,
            name: 'Jane Smith',
            email: 'manager1@store.com',
            createdAt: new Date().toISOString(),
          }
        }
      };

      const demoUser = demoUsers[username as keyof typeof demoUsers];
      if (!demoUser || password !== 'password123') {
        return false;
      }

      try {
        // Try to sign in first
        await signIn(demoUser.email, password);
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          // Create the user if they don't exist
          await signUp(demoUser.email, password, demoUser.userData);
        } else {
          throw error;
        }
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    ...authState,
    loading,
    login,
    logout,
  };
};