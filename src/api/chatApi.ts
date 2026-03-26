const BASE_URL = 'https://functions.poehali.dev/f6cae849-85b2-4c0b-8164-397266e688b3';
const USER_ID = '1';

const headers = {
  'Content-Type': 'application/json',
  'X-User-Id': USER_ID,
};

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
  const res = await fetch(`${BASE_URL}?action=chats`, { headers });
  const data = await res.json();
  return data.chats || [];
}

export async function fetchMessages(chatId: number): Promise<ApiMessage[]> {
  const res = await fetch(`${BASE_URL}?action=messages&chat_id=${chatId}`, { headers });
  const data = await res.json();
  return data.messages || [];
}

export async function sendMessage(chatId: number, text: string): Promise<ApiMessage> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ action: 'send', chat_id: chatId, text }),
  });
  return res.json();
}