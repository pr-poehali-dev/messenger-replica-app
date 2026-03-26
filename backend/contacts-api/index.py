"""API поиска пользователей по @username и создания новых чатов"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def json_resp(data, status=200):
    return {
        'statusCode': status,
        'headers': {**CORS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False)
    }

def get_user_id(cur, token: str):
    if not token:
        return None
    cur.execute("SELECT user_id FROM sessions WHERE token = %s AND expires_at > NOW()", (token,))
    row = cur.fetchone()
    return row['user_id'] if row else None

def handler(event: dict, context) -> dict:
    """Поиск по @username и создание личного чата"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    token = (event.get('headers') or {}).get('X-Session-Token', '')
    qs = event.get('queryStringParameters') or {}

    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    user_id = get_user_id(cur, token)
    if not user_id:
        conn.close()
        return json_resp({'error': 'Не авторизован'}, 401)

    # GET ?action=search&q=@username — поиск пользователя
    if method == 'GET' and qs.get('action') == 'search':
        query = qs.get('q', '').strip().lstrip('@').lower()
        if len(query) < 2:
            conn.close()
            return json_resp({'users': []})

        cur.execute("""
            SELECT id, username, display_name, avatar_initials
            FROM users
            WHERE (LOWER(username) LIKE %s OR LOWER(display_name) ILIKE %s)
              AND id != %s
            LIMIT 20
        """, (f'{query}%', f'%{query}%', user_id))
        users = [dict(r) for r in cur.fetchall()]
        conn.close()
        return json_resp({'users': users})

    # POST {action: start_chat, target_user_id} — создать или открыть личный чат
    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        action = body.get('action')

        if action == 'start_chat':
            target_id = int(body.get('target_user_id', 0))
            if not target_id:
                conn.close()
                return json_resp({'error': 'Укажите пользователя'}, 400)

            # Ищем уже существующий личный чат между двумя пользователями
            cur.execute("""
                SELECT c.id FROM chats c
                JOIN chat_members cm1 ON cm1.chat_id = c.id AND cm1.user_id = %s
                JOIN chat_members cm2 ON cm2.chat_id = c.id AND cm2.user_id = %s
                WHERE c.type = 'personal'
                LIMIT 1
            """, (user_id, target_id))
            existing = cur.fetchone()

            if existing:
                conn.close()
                return json_resp({'ok': True, 'chat_id': existing['id'], 'is_new': False})

            # Получаем данные собеседника для названия чата
            cur.execute("SELECT display_name, avatar_initials FROM users WHERE id = %s", (target_id,))
            target = cur.fetchone()
            if not target:
                conn.close()
                return json_resp({'error': 'Пользователь не найден'}, 404)

            # Создаём чат
            cur.execute("""
                INSERT INTO chats (name, type, avatar, verified)
                VALUES (%s, 'personal', %s, FALSE)
                RETURNING id
            """, (target['display_name'], target['avatar_initials']))
            chat_id = cur.fetchone()['id']

            # Добавляем обоих участников
            cur.execute("INSERT INTO chat_members (chat_id, user_id) VALUES (%s, %s), (%s, %s)",
                        (chat_id, user_id, chat_id, target_id))
            conn.commit()
            conn.close()
            return json_resp({'ok': True, 'chat_id': chat_id, 'is_new': True})

    conn.close()
    return json_resp({'error': 'Not found'}, 404)
