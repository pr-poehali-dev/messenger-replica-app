import { authHeaders } from './authApi';

const CONTACTS_URL = 'https://functions.poehali.dev/e7a693e6-33a6-40a4-97a8-6bac4e15ec89';

export interface FoundUser {
  id: number;
  username: string;
  display_name: string;
  avatar_initials: string;
}

export async function searchUsers(query: string): Promise<FoundUser[]> {
  try {
    const res = await fetch(`${CONTACTS_URL}?action=search&q=${encodeURIComponent(query)}`, {
      headers: authHeaders(),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.users || [];
  } catch {
    return [];
  }
}

export async function startChat(targetUserId: number): Promise<{ ok: boolean; chat_id?: number; is_new?: boolean; error?: string }> {
  try {
    const res = await fetch(CONTACTS_URL, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ action: 'start_chat', target_user_id: targetUserId }),
    });
    return res.json();
  } catch {
    return { ok: false, error: 'Нет соединения' };
  }
}

export async function checkUsername(username: string): Promise<{ available: boolean; error?: string }> {
  try {
    const AUTH_URL = 'https://functions.poehali.dev/5bfea82b-0665-43a1-b3b9-96d1949bdd8f';
    const res = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'check_username', username }),
    });
    return res.json();
  } catch {
    return { available: false, error: 'Нет соединения' };
  }
}
