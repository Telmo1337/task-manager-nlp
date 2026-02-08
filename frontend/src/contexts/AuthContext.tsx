import { useState, useEffect, useCallback, type ReactNode } from "react";
import type { AuthState, LoginCredentials, RegisterCredentials } from "../types/auth";
import * as authApi from "../lib/auth";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    async function checkAuth() {
      const tokens = authApi.getStoredTokens();
      
      if (!tokens) {
        setState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      try {
        const user = await authApi.getProfile();
        setState({ user, isAuthenticated: true, isLoading: false });
      } catch {
        authApi.clearTokens();
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    }

    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { user } = await authApi.login(credentials);
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    const { user } = await authApi.register(credentials);
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
