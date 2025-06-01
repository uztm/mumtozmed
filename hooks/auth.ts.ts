// auth.ts

const TOKEN_KEY = "auth_token";

// Save token to localStorage
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

// Retrieve token from localStorage
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function logOut() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/auth/login";
  }
}
