import type { AuthUser, LoginCredentials, RegisterCredentials } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Access token lives in memory only — never persisted to localStorage.
// Refresh token lives in an httpOnly cookie managed by the browser.
let _accessToken: string | null = null;

export function getAccessToken(): string | null {
  return _accessToken;
}

export function storeAccessToken(accessToken: string): void {
  _accessToken = accessToken;
}

export function clearTokens(): void {
  _accessToken = null;
}

// Alias used by api.ts
export const removeTokens = clearTokens;

// Used by AuthContext to detect an active in-memory session.
// Returns null when the page has been reloaded (token gone) — AuthContext
// will attempt a silent refresh via the httpOnly cookie instead.
export function getStoredTokens(): { accessToken: string } | null {
  return _accessToken ? { accessToken: _accessToken } : null;
}

export async function login(credentials: LoginCredentials): Promise<{ user: AuthUser }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  _accessToken = data.accessToken;
  return { user: data.user };
}

export async function register(credentials: RegisterCredentials): Promise<{ user: AuthUser }> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  _accessToken = data.accessToken;
  return { user: data.user };
}

export async function logout(): Promise<void> {
  if (_accessToken) {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${_accessToken}`,
        },
        credentials: "include",
      });
    } catch {
      // Ignore logout errors — tokens are cleared locally regardless
    }
  }
  _accessToken = null;
}

export async function refreshTokens(): Promise<{ accessToken: string }> {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    _accessToken = null;
    throw new Error(data.message || "Token refresh failed");
  }

  _accessToken = data.accessToken;
  return { accessToken: data.accessToken };
}

export async function refreshAccessToken(): Promise<boolean> {
  try {
    await refreshTokens();
    return true;
  } catch {
    return false;
  }
}

export async function getProfile(): Promise<AuthUser> {
  if (!_accessToken) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${_accessToken}` },
    credentials: "include",
  });

  if (res.status === 401) {
    try {
      await refreshTokens();
      return getProfile();
    } catch {
      _accessToken = null;
      throw new Error("Session expired");
    }
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to get profile");
  }

  return data.user;
}
