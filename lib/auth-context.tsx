"use client";

// =============================================
// Auth Context Provider
// Manages authentication state across the app
// =============================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthResponse } from "@/lib/types/dummyjson";
import {
  setAuthData,
  getStoredUser,
  clearAuthData,
  isAuthenticated as checkAuth,
} from "@/lib/api/auth";
import { login as apiLogin } from "@/lib/api/dummyjson";
import { useRouter } from "next/navigation";

interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore user from localStorage on mount (deferred to avoid synchronous setState in effect)
  useEffect(() => {
    const stored = getStoredUser();
    const authenticated = !!(stored && checkAuth());
    queueMicrotask(() => {
      if (authenticated && stored) setUser(stored as AuthUser);
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      const data: AuthResponse = await apiLogin({ username, password });
      setAuthData(data);
      const authUser: AuthUser = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        image: data.image,
      };
      setUser(authUser);
      router.push("/");
    },
    [router]
  );

  const logout = useCallback(() => {
    clearAuthData();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to access auth context. Must be used inside AuthProvider. */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
