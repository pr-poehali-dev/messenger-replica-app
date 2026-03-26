"""API для работы с чатами: список чатов, сообщения, отправка"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Обработчик: GET ?action=chats | GET ?action=messages&chat_id=N | POST {action,chat_id,text}"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    user_id = int((event.get('headers') or {}).get('X-User-Id', '1') or '1')
    qs = event.get('queryStringParameters') or {}

    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    if method == 'GET':
        action = qs.get('action', 'chats')

        if action == 'chats':
            cur.execute("""
                SELECT
                    c.id,
                    c.name,
                    c.type,
                    c.avatar,
                    c.verified,
                    cm.muted,
                    m.text AS last_message,
                    TO_CHAR(m.created_at, 'HH24:MI') AS last_time,
                    (
                        SELECT COUNT(*) FROM messages unread
                        WHERE unread.chat_id = c.id
                        AND (unread.sender_id != %s OR unread.sender_id IS NULL)
                        AND unread.created_at > COALESCE(
                            (SELECT MAX(created_at) FROM messages
                             WHERE chat_id = c.id AND sender_id = %s),
                            '1970-01-01'
                        )
                    ) AS unread_count
                FROM chats c
                JOIN chat_members cm ON cm.chat_id = c.id AND cm.user_id = %s
                LEFT JOIN LATERAL (
                    SELECT text, created_at FROM messages
                    WHERE chat_id = c.id
                    ORDER BY created_at DESC LIMIT 1
                ) m ON TRUE
                GROUP BY c.id, c.name, c.type, c.avatar, c.verified, cm.muted, m.text, m.created_at
                ORDER BY m.created_at DESC NULLS LAST
            """, (user_id, user_id, user_id))
            chats = [dict(r) for r in cur.fetchall()]
            conn.close()
            return {
                'statusCode': 200,
                'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'chats': chats})
            }

        if action == 'messages':
            chat_id = int(qs.get('chat_id', 0))
            cur.execute("""
                SELECT
                    m.id,
                    m.chat_id,
                    m.text,
                    m.sender_id,
                    u.display_name AS sender_name,
                    u.avatar_initials AS sender_avatar,
                    m.forwarded,
                    m.reply_to_id,
                    TO_CHAR(m.created_at, 'HH24:MI') AS time,
                    (m.sender_id = %s) AS is_out
                FROM messages m
                LEFT JOIN users u ON u.id = m.sender_id
                WHERE m.chat_id = %s
                ORDER BY m.created_at ASC
            """, (user_id, chat_id))
            msgs = [dict(r) for r in cur.fetchall()]
            conn.close()
            return {
                'statusCode': 200,
                'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'messages': msgs, 'chat_id': chat_id})
            }

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        action = body.get('action', 'send')

        if action == 'send':
            chat_id = int(body.get('chat_id', 0))
            text = (body.get('text') or '').strip()
            if not text or not chat_id:
                conn.close()
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Пустое сообщение или chat_id'})}

            cur.execute("""
                INSERT INTO messages (chat_id, sender_id, text)
                VALUES (%s, %s, %s)
                RETURNING id, TO_CHAR(created_at, 'HH24:MI') AS time
            """, (chat_id, user_id, text))
            row = dict(cur.fetchone())
            conn.commit()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'id': row['id'], 'time': row['time'], 'text': text, 'is_out': True})
            }

    conn.close()
    return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}
