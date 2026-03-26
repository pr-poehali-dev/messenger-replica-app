import { authHeaders, CHATS_URL } from './authApi';

const BASE_URL = CHATS_URL;

export interface ApiChat {
  id: number;
  name: string;
  type: 'personal' | 'group' | 'channel' | 'bot';
  avatar: string;
  verified: boolean;
  muted: boolean;
  last_message: string | null;
  last_time: string | null;
  unread_count: number | string;
}

export interface ApiMessage {
  id: number;
  chat_id: number;
  text: string;
  sender_id: number | null;
  sender_name: string | null;
  sender_avatar: string | null;
  forwarded: boolean;
  reply_to_id: number | null;
  time: string;
  is_out: boolean;
}

export async function fetchChats(): Promise<ApiChat[]> {
  try {
    const res = await fetch(`${BASE_URL}?action=chats`, { headers: authHeaders() });
    if (!res.ok) return [];
    const data = await res.json();
    return data.chats || [];
  } catch {
    return [];
  }
}

export async function fetchMessages(chatId: number): Promise<ApiMessage[]> {
  try {
    const res = await fetch(`${BASE_URL}?action=messages&chat_id=${chatId}`, { headers: authHeaders() });
    if (!res.ok) return [];
    const data = await res.json();
    return data.messages || [];
  } catch {
    return [];
  }
}

export async function sendMessage(chatId: number, text: string): Promise<ApiMessage> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ action: 'send', chat_id: chatId, text }),
  });
  return res.json();
}
