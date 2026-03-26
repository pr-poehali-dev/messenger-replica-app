INSERT INTO chat_members (chat_id, user_id)
SELECT 1, 1 WHERE NOT EXISTS (SELECT 1 FROM chat_members WHERE chat_id=1 AND user_id=1);
INSERT INTO chat_members (chat_id, user_id)
SELECT 1, 2 WHERE NOT EXISTS (SELECT 1 FROM chat_members WHERE chat_id=1 AND user_id=2);
INSERT INTO chat_members (chat_id, user_id)
SELECT 2, 1 WHERE NOT EXISTS (SELECT 1 FROM chat_members WHERE chat_id=2 AND user_id=1);
INSERT INTO chat_members (chat_id, user_id)
SELECT 2, 2 WHERE NOT EXISTS (SELECT 1 FROM chat_members WHERE chat_id=2 AND user_id=2);
INSERT INTO chat_members (chat_id, user_id)
SELECT 2, 3 WHERE NOT EXISTS (SELECT 1 FROM chat_members WHERE chat_id=2 AND user_id=3);
INSERT INTO chat_members (chat_id, user_id)
SELECT 2, 4 WHERE NOT EXISTS (SELECT 1 FROM chat_members WHERE chat_id=2 AND user_id=4);
INSERT INTO chat_members (chat_id, user_id)
SELECT 3, 1 WHERE NOT EXISTS (SELECT 1 FROM chat_members WHERE chat_id=3 AND user_id=1);
INSERT INTO chat_members (chat_id, user_id)
SELECT 4, 1 WHERE NOT EXISTS (SELECT 1 FROM chat_members WHERE chat_id=4 AND user_id=1);
INSERT INTO chat_members (chat_id, user_id)
SELECT 4, 3 WHERE NOT EXISTS (SELECT 1 FROM chat_members WHERE chat_id=4 AND user_id=3);
INSERT INTO chat_members (chat_id, user_id)
SELECT 5, 1 WHERE NOT EXISTS (SELECT 1 FROM chat_members WHERE chat_id=5 AND user_id=1);
INSERT INTO chat_members (chat_id, user_id)
SELECT 5, 4 WHERE NOT EXISTS (SELECT 1 FROM chat_members WHERE chat_id=5 AND user_id=4);
INSERT INTO chat_members (chat_id, user_id)
SELECT 6, 1 WHERE NOT EXISTS (SELECT 1 FROM chat_members WHERE chat_id=6 AND user_id=1);

INSERT INTO messages (chat_id, sender_id, text) VALUES
  (1, 2, 'Привет! Как дела?'),
  (1, 1, 'Отлично, спасибо! Работаю над проектом'),
  (1, 2, 'Какой проект?'),
  (1, 1, 'Мессенджер, похожий на Telegram 😄'),
  (1, 2, 'Звучит интересно! Могу показать завтра?'),
  (1, 1, 'Конечно! Увидимся в 10 утра'),
  (2, 2, 'Всем привет! Обсудим задачи на неделю'),
  (2, 1, 'Готов слушать'),
  (2, 3, 'Я тоже здесь'),
  (2, 2, 'Дизайн согласован ✅'),
  (3, NULL, '🔥 Прорыв в AI: новая модель побила рекорды'),
  (3, NULL, '🚀 SpaceX запустила 60 спутников Starlink'),
  (3, NULL, '💻 Apple анонсировала новый чип M4 Ultra'),
  (4, 3, 'Привет! Можешь помочь с вопросом?'),
  (4, 1, 'Конечно, что случилось?'),
  (4, 3, 'Спасибо за помощь!'),
  (5, 4, 'Привет, встречаемся у кафе в 15:00?'),
  (5, 1, 'Да, буду там'),
  (5, 4, 'Договорились 👌'),
  (6, NULL, 'Привет! Я твой персональный помощник. Чем могу помочь?');
