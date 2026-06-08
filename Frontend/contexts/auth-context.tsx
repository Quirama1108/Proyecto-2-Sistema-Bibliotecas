"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { useRouter } from "next/navigation";
import { getMe, login as apiLogin, register as apiRegister } from "@/lib/api";
import { clearSession, getToken, saveSession } from "@/lib/auth-storage";
import type { User } from "@/lib/types";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }
    const result = await getMe();
    saveSession(token, result.user);
    setUser(result.user);
  }, []);

  useEffect(() => {
    async function initSession() {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        await refreshUser();
      } catch {
        clearSession();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    initSession();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiLogin(email, password);
    saveSession(result.token, result.user);
    setUser(result.user);
    router.push("/transacciones");
  }, [router]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await apiRegister({ name, email, password });
    saveSession(result.token, result.user);
    setUser(result.user);
    router.push("/transacciones");
  }, [router]);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser
    }),
    [user, isLoading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
