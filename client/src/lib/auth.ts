const TOKEN_KEY = 'ai_interview_token';
const USER_KEY = 'ai_interview_user';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setStoredUser(user: object) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeStoredUser() {
  localStorage.removeItem(USER_KEY);
}

export function clearAuth() {
  removeToken();
  removeStoredUser();
}
