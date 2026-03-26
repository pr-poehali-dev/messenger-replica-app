CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(64) UNIQUE NOT NULL,
  display_name VARCHAR(128) NOT NULL,
  phone VARCHAR(32),
  avatar_initials VARCHAR(8) DEFAULT '',
  bio TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chats (
  id SERIAL PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  type VARCHAR(16) NOT NULL,
  avatar VARCHAR(16) DEFAULT '',
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_members (
  id SERIAL PRIMARY KEY,
  chat_id INTEGER REFERENCES chats(id),
  user_id INTEGER REFERENCES users(id),
  role VARCHAR(16) DEFAULT 'member',
  muted BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(chat_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  chat_id INTEGER REFERENCES chats(id),
  sender_id INTEGER REFERENCES users(id),
  text TEXT NOT NULL,
  reply_to_id INTEGER,
  forwarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS message_reactions (
  id SERIAL PRIMARY KEY,
  message_id INTEGER REFERENCES messages(id),
  user_id INTEGER REFERENCES users(id),
  emoji VARCHAR(16) NOT NULL,
  UNIQUE(message_id, user_id, emoji)
);
