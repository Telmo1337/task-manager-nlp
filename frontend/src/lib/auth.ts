import type { AuthUser, AuthTokens, LoginCredentials, RegisterCredentials } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const TOKEN_KEY = "task-manager-access-token";
const REFRESH_TOKEN_KEY = "task-manager-refresh-token";

export function getStoredTokens(): AuthTokens | null {
  const accessToken = localStorage.getItem(TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  
  if (!accessToken || !refreshToken) return null;
  
  return { accessToken, refreshToken };
}

export function storeTokens(tokens: AuthTokens): void {
  localStorage.setItem(TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// Aliases for api.ts compatibility
export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeTokens(): void {
  clearTokens();
}

export function getAuthHeader(): Record<string, string> {
  const tokens = getStoredTokens();
  if (!tokens) return {};
  return { Authorization: `Bearer ${tokens.accessToken}` };
}

export async function login(credentials: LoginCredentials): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  storeTokens(data.tokens);
  return { user: data.user, tokens: data.tokens };
}

export async function register(credentials: RegisterCredentials): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  storeTokens(data.tokens);
  return { user: data.user, tokens: data.tokens };
}

export async function logout(): Promise<void> {
  const tokens = getStoredTokens();
  
  if (tokens) {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
    } catch {
      // Ignore logout errors, we'll clear tokens anyway
    }
  }
  
  clearTokens();
}

export async function refreshTokens(): Promise<AuthTokens> {
  const tokens = getStoredTokens();
  
  if (!tokens) {
    throw new Error("No refresh token available");
  }

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: tokens.refreshToken }),
  });

  const data = await res.json();

  if (!res.ok) {
    clearTokens();
    throw new Error(data.message || "Token refresh failed");
  }

  storeTokens(data.tokens);
  return data.tokens;
}

// Alias for api.ts - returns boolean indicating success
export async function refreshAccessToken(): Promise<boolean> {
  try {
    await refreshTokens();
    return true;
  } catch {
    return false;
  }
}

export async function getProfile(): Promise<AuthUser> {
  const tokens = getStoredTokens();
  
  if (!tokens) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
    },
  });

  if (res.status === 401) {
    // Try to refresh tokens
    try {
      await refreshTokens();
      return getProfile();
    } catch {
      clearTokens();
      throw new Error("Session expired");
    }
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to get profile");
  }

  return data.user;
}
