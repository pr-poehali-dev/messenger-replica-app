export interface Message {
  id: number;
  text: string;
  time: string;
  isOut: boolean;
  status?: 'sent' | 'delivered' | 'read';
  replyTo?: string;
  mediaType?: 'image' | 'file' | 'audio' | 'sticker';
  mediaUrl?: string;
  reactions?: { emoji: string; count: number }[];
  forwarded?: boolean;
}

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
  type: 'personal' | 'group' | 'channel' | 'bot';
  verified?: boolean;
  muted?: boolean;
  pinned?: boolean;
  messages: Message[];
}

export const chats: Chat[] = [
  {
    id: 1,
    name: "Алексей Петров",
    avatar: "АП",
    lastMessage: "Увидимся завтра в 10 утра!",
    time: "22:14",
    unread: 3,
    online: true,
    type: "personal",
    messages: [
      { id: 1, text: "Привет! Как дела?", time: "21:40", isOut: false, status: "read" },
      { id: 2, text: "Отлично, спасибо! Работаю над проектом", time: "21:42", isOut: true, status: "read" },
      { id: 3, text: "Какой проект?", time: "21:43", isOut: false },
      { id: 4, text: "Мессенджер, похожий на Telegram 😄", time: "21:44", isOut: true, status: "read" },
      { id: 5, text: "Звучит интересно! Давно хотел что-то такое сделать", time: "21:50", isOut: false },
      { id: 6, text: "Могу показать завтра, если хочешь", time: "21:52", isOut: true, status: "read" },
      { id: 7, text: "Конечно! Когда удобно?", time: "22:10", isOut: false },
      { id: 8, text: "Увидимся завтра в 10 утра!", time: "22:14", isOut: false },
    ]
  },
  {
    id: 2,
    name: "Команда проекта",
    avatar: "КП",
    lastMessage: "Дизайн согласован ✅",
    time: "21:58",
    unread: 12,
    type: "group",
    messages: [
      { id: 1, text: "Всем привет! Нужно обсудить задачи на неделю", time: "09:00", isOut: false },
      { id: 2, text: "Готов слушать", time: "09:05", isOut: true, status: "read" },
      { id: 3, text: "Я тоже здесь", time: "09:06", isOut: false },
      { id: 4, text: "Итак, первое — нужно закончить дизайн к пятнице", time: "09:10", isOut: false },
      { id: 5, text: "Понял, беру на себя", time: "09:12", isOut: true, status: "read" },
      { id: 6, text: "Дизайн согласован ✅", time: "21:58", isOut: false, reactions: [{ emoji: "👍", count: 4 }, { emoji: "🎉", count: 2 }] },
    ]
  },
  {
    id: 3,
    name: "Новости технологий",
    avatar: "НТ",
    lastMessage: "Apple анонсировала новый чип",
    time: "20:30",
    unread: 0,
    type: "channel",
    verified: true,
    messages: [
      { id: 1, text: "🔥 Прорыв в AI: новая модель показала результаты, превосходящие человека в задачах программирования", time: "10:00", isOut: false },
      { id: 2, text: "🚀 SpaceX успешно запустила 60 новых спутников Starlink", time: "14:30", isOut: false },
      { id: 3, text: "💻 Apple анонсировала новый чип M4 Ultra с 512GB памяти", time: "20:30", isOut: false },
    ]
  },
  {
    id: 4,
    name: "Мария Иванова",
    avatar: "МИ",
    lastMessage: "Спасибо за помощь!",
    time: "19:45",
    unread: 0,
    online: true,
    type: "personal",
    messages: [
      { id: 1, text: "Привет! Можешь помочь с вопросом?", time: "19:20", isOut: false },
      { id: 2, text: "Конечно, что случилось?", time: "19:22", isOut: true, status: "read" },
      { id: 3, text: "Не могу разобраться с настройками", time: "19:25", isOut: false },
      { id: 4, text: "Зайди в меню → Настройки → Безопасность", time: "19:30", isOut: true, status: "read" },
      { id: 5, text: "Спасибо за помощь!", time: "19:45", isOut: false },
    ]
  },
  {
    id: 5,
    name: "Помощник Юра",
    avatar: "ЮА",
    lastMessage: "Чем могу помочь?",
    time: "18:00",
    unread: 0,
    type: "bot",
    messages: [
      { id: 1, text: "Привет! Я твой персональный помощник. Чем могу помочь?", time: "18:00", isOut: false },
    ]
  },
  {
    id: 6,
    name: "Семья",
    avatar: "👨‍👩‍👧‍👦",
    lastMessage: "Приедем в воскресенье",
    time: "17:22",
    unread: 2,
    type: "group",
    messages: [
      { id: 1, text: "Все готовы к встрече?", time: "16:00", isOut: false },
      { id: 2, text: "Да, ждём!", time: "16:30", isOut: true, status: "read" },
      { id: 3, text: "Приедем в воскресенье", time: "17:22", isOut: false },
    ]
  },
  {
    id: 7,
    name: "Дмитрий Смирнов",
    avatar: "ДС",
    lastMessage: "Договорились 👌",
    time: "16:05",
    unread: 0,
    type: "personal",
    muted: true,
    messages: [
      { id: 1, text: "Привет, встречаемся у кафе в 15:00?", time: "14:00", isOut: false },
      { id: 2, text: "Да, буду там", time: "14:05", isOut: true, status: "read" },
      { id: 3, text: "Договорились 👌", time: "16:05", isOut: false },
    ]
  },
  {
    id: 8,
    name: "Крипто Сигналы",
    avatar: "₿",
    lastMessage: "BTC +5.2% за 24ч",
    time: "15:00",
    unread: 0,
    type: "channel",
    muted: true,
    messages: [
      { id: 1, text: "📈 BTC пробил уровень сопротивления $68,000", time: "12:00", isOut: false },
      { id: 2, text: "🚀 ETH показывает силу, рост +8% за неделю", time: "14:00", isOut: false },
      { id: 3, text: "💰 BTC +5.2% за 24ч — бычий тренд продолжается", time: "15:00", isOut: false },
    ]
  }
];
