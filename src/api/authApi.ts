const AUTH_URL = 'https://functions.poehali.dev/5bfea82b-0665-43a1-b3b9-96d1949bdd8f';
const CHATS_URL = 'https://functions.poehali.dev/f6cae849-85b2-4c0b-8164-397266e688b3';

const TOKEN_KEY = 'мини_token';

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Session-Token': getToken(),
  };
}

export interface AuthUser {
  id: number;
  username: string;
  display_name: string;
  phone: string;
  avatar_initials: string;
}

export async function sendCode(phone: string): Promise<{ ok: boolean; demo_code?: string; demo?: boolean; error?: string }> {
  try {
    const res = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'send_code', phone }),
    });
    return res.json();
  } catch {
    return { ok: false, error: 'Нет соединения с сервером' };
  }
}

export async function verifyCode(phone: string, code: string, name?: string, username?: string): Promise<{
  ok: boolean;
  token?: string;
  user?: AuthUser;
  is_new?: boolean;
  error?: string;
}> {
  try {
    const res = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify_code', phone, code, name, username }),
    });
    return res.json();
  } catch {
    return { ok: false, error: 'Нет соединения с сервером' };
  }
}

export async function getMe(): Promise<AuthUser | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
      body: JSON.stringify({ action: 'me' }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}

export async function logout() {
  try {
    await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Session-Token': getToken() },
      body: JSON.stringify({ action: 'logout' }),
    });
  } catch {
    // игнорируем ошибку сети при выходе
  }
  clearToken();
}

export { CHATS_URL };