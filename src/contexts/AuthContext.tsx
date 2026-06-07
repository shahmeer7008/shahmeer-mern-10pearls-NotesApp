import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthSession } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const TOKEN_KEY = 'notes_app_token';

interface AuthContextType {
  session: AuthSession | null;
  loading: boolean;
  user: { id: string; email?: string } | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem(TOKEN_KEY);
          setLoading(false);
          return;
        }

        const { data } = await response.json();
        setSession({ user: data, token });
      } catch (_err) {
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, []);

  const signUp = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const { data, error } = await response.json();
    if (!response.ok) {
      throw new Error(error?.message || 'Signup failed');
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    setSession({ user: data.user, token: data.token });
  };

  const signIn = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const { data, error } = await response.json();
    if (!response.ok) {
      throw new Error(error?.message || 'Login failed');
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    setSession({ user: data.user, token: data.token });
  };

  const signOut = async () => {
    localStorage.removeItem(TOKEN_KEY);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        user: session?.user || null,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
