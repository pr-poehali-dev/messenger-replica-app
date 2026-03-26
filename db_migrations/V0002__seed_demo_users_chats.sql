INSERT INTO users (username, display_name, phone, avatar_initials)
SELECT 'me', 'Вы', '+7 900 000-00-00', 'ВП'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'me');

INSERT INTO users (username, display_name, phone, avatar_initials)
SELECT 'alex_petrov', 'Алексей Петров', '+7 911 111-11-11', 'АП'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'alex_petrov');

INSERT INTO users (username, display_name, phone, avatar_initials)
SELECT 'maria_ivanova', 'Мария Иванова', '+7 922 222-22-22', 'МИ'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'maria_ivanova');

INSERT INTO users (username, display_name, phone, avatar_initials)
SELECT 'dmitry_smirnov', 'Дмитрий Смирнов', '+7 933 333-33-33', 'ДС'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'dmitry_smirnov');

INSERT INTO chats (name, type, avatar, verified)
SELECT 'Алексей Петров', 'personal', 'АП', FALSE
WHERE NOT EXISTS (SELECT 1 FROM chats WHERE name = 'Алексей Петров' AND type = 'personal');

INSERT INTO chats (name, type, avatar, verified)
SELECT 'Команда проекта', 'group', 'КП', FALSE
WHERE NOT EXISTS (SELECT 1 FROM chats WHERE name = 'Команда проекта');

INSERT INTO chats (name, type, avatar, verified)
SELECT 'Новости технологий', 'channel', 'НТ', TRUE
WHERE NOT EXISTS (SELECT 1 FROM chats WHERE name = 'Новости технологий');

INSERT INTO chats (name, type, avatar, verified)
SELECT 'Мария Иванова', 'personal', 'МИ', FALSE
WHERE NOT EXISTS (SELECT 1 FROM chats WHERE name = 'Мария Иванова' AND type = 'personal');

INSERT INTO chats (name, type, avatar, verified)
SELECT 'Дмитрий Смирнов', 'personal', 'ДС', FALSE
WHERE NOT EXISTS (SELECT 1 FROM chats WHERE name = 'Дмитрий Смирнов' AND type = 'personal');

INSERT INTO chats (name, type, avatar, verified)
SELECT 'Помощник Юра', 'bot', 'ЮА', FALSE
WHERE NOT EXISTS (SELECT 1 FROM chats WHERE name = 'Помощник Юра');
