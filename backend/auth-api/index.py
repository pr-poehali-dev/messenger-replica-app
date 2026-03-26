"""Авторизация по номеру телефона: отправка кода и верификация"""
import json
import os
import random
import string
import secrets
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def json_response(data, status=200):
    return {
        'statusCode': status,
        'headers': {**CORS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False)
    }

def normalize_phone(phone: str) -> str:
    digits = ''.join(c for c in phone if c.isdigit())
    if digits.startswith('8') and len(digits) == 11:
        digits = '7' + digits[1:]
    return '+' + digits

def handler(event: dict, context) -> dict:
    """Обработчик авторизации: send_code, verify_code, me, logout"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'POST')
    body = json.loads(event.get('body') or '{}')
    action = body.get('action') or (event.get('queryStringParameters') or {}).get('action', '')
    token = (event.get('headers') or {}).get('X-Session-Token', '')

    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    # Проверка сессии
    if action == 'me':
        if not token:
            conn.close()
            return json_response({'error': 'Нет токена'}, 401)
        cur.execute("""
            SELECT u.id, u.username, u.display_name, u.phone, u.avatar_initials
            FROM sessions s JOIN users u ON u.id = s.user_id
            WHERE s.token = %s AND s.expires_at > NOW()
        """, (token,))
        user = cur.fetchone()
        conn.close()
        if not user:
            return json_response({'error': 'Сессия истекла'}, 401)
        return json_response({'user': dict(user)})

    # Выход
    if action == 'logout':
        if token:
            cur.execute("UPDATE sessions SET expires_at = NOW() WHERE token = %s", (token,))
            conn.commit()
        conn.close()
        return json_response({'ok': True})

    # Отправка кода
    if action == 'send_code':
        phone_raw = body.get('phone', '').strip()
        if not phone_raw:
            conn.close()
            return json_response({'error': 'Укажите номер телефона'}, 400)
        phone = normalize_phone(phone_raw)
        if len(phone) < 11:
            conn.close()
            return json_response({'error': 'Неверный формат номера'}, 400)

        code = ''.join(random.choices(string.digits, k=5))
        expires_at = datetime.now() + timedelta(minutes=10)

        cur.execute("""
            INSERT INTO auth_codes (phone, code, expires_at)
            VALUES (%s, %s, %s)
        """, (phone, code, expires_at))
        conn.commit()
        conn.close()

        # В prod здесь была бы отправка SMS. Сейчас возвращаем код в ответе для демо.
        return json_response({'ok': True, 'phone': phone, 'demo_code': code,
                              'message': 'Код отправлен (демо-режим: код в ответе)'})

    # Верификация кода
    if action == 'verify_code':
        phone_raw = body.get('phone', '').strip()
        code = str(body.get('code', '')).strip()
        name = body.get('name', '').strip()

        if not phone_raw or not code:
            conn.close()
            return json_response({'error': 'Укажите телефон и код'}, 400)

        phone = normalize_phone(phone_raw)

        cur.execute("""
            SELECT id FROM auth_codes
            WHERE phone = %s AND code = %s AND used = FALSE AND expires_at > NOW()
            ORDER BY created_at DESC LIMIT 1
        """, (phone, code))
        code_row = cur.fetchone()
        if not code_row:
            conn.close()
            return json_response({'error': 'Неверный или истёкший код'}, 400)

        cur.execute("UPDATE auth_codes SET used = TRUE WHERE id = %s", (code_row['id'],))

        # Находим или создаём пользователя
        cur.execute("SELECT id, display_name, username, avatar_initials FROM users WHERE phone = %s", (phone,))
        user = cur.fetchone()
        is_new = False

        if not user:
            is_new = True
            display_name = name or 'Пользователь'
            initials = ''.join(w[0].upper() for w in display_name.split()[:2])
            username = 'user_' + ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
            cur.execute("""
                INSERT INTO users (username, display_name, phone, avatar_initials, phone_verified)
                VALUES (%s, %s, %s, %s, TRUE)
                RETURNING id, display_name, username, avatar_initials
            """, (username, display_name, phone, initials))
            user = cur.fetchone()

        # Создаём сессию на 30 дней
        token_val = secrets.token_hex(32)
        expires = datetime.now() + timedelta(days=30)
        cur.execute("""
            INSERT INTO sessions (token, user_id, expires_at)
            VALUES (%s, %s, %s)
        """, (token_val, user['id'], expires))
        conn.commit()
        conn.close()

        return json_response({
            'ok': True,
            'token': token_val,
            'is_new': is_new,
            'user': dict(user)
        })

    conn.close()
    return json_response({'error': 'Неизвестное действие'}, 404)
