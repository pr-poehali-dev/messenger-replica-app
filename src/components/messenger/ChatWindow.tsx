import { useState, useRef, useEffect } from "react";
import { Chat, Message } from "@/data/mockData";
import Avatar from "./Avatar";
import Icon from "@/components/ui/icon";

interface ChatWindowProps {
  chat: Chat | null;
  onSendMessage: (chatId: number, text: string) => void;
  onBack?: () => void;
}

export default function ChatWindow({ chat, onSendMessage, onBack }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [showAttach, setShowAttach] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center" style={{ background: "hsl(var(--chat-bg))" }}>
        <div className="flex flex-col items-center gap-4 text-[hsl(var(--muted-foreground))] animate-fade-in">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: "hsl(var(--muted))" }}
          >
            <Icon name="MessageCircle" size={48} />
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold text-[hsl(var(--foreground))]">Выберите чат</p>
            <p className="text-sm mt-1">Выберите диалог слева, чтобы начать общение</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    onSendMessage(chat.id, text);
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const emojis = ["😀", "😂", "❤️", "👍", "🔥", "🎉", "😢", "🤔", "👀", "💯", "🚀", "✅"];

  return (
    <div className="flex-1 flex flex-col min-w-0" style={{ background: "hsl(var(--chat-bg))" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b border-[hsl(var(--border))] flex-shrink-0"
        style={{ background: "hsl(var(--header-bg))" }}
      >
        {onBack && (
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[hsl(var(--muted-foreground))] hover:text-white mr-1"
          >
            <Icon name="ArrowLeft" size={20} />
          </button>
        )}
        <Avatar name={chat.avatar} online={chat.online} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            {chat.verified && <Icon name="BadgeCheck" size={14} style={{ color: "var(--tg-blue)" }} />}
            <p className="text-white font-semibold text-[15px] truncate">{chat.name}</p>
          </div>
          <p className="text-xs" style={{ color: "var(--tg-blue)" }}>
            {chat.online
              ? "в сети"
              : chat.type === "group"
              ? `${chat.messages.length} участников`
              : chat.type === "channel"
              ? "канал"
              : chat.type === "bot"
              ? "бот"
              : "был(а) недавно"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[hsl(var(--muted-foreground))] hover:text-white">
            <Icon name="Phone" size={18} />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[hsl(var(--muted-foreground))] hover:text-white">
            <Icon name="Video" size={18} />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[hsl(var(--muted-foreground))] hover:text-white">
            <Icon name="Search" size={18} />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[hsl(var(--muted-foreground))] hover:text-white">
            <Icon name="MoreVertical" size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
        <DateDivider date="Сегодня" />
        {chat.messages.map((msg, i) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            prevIsOut={i > 0 ? chat.messages[i - 1].isOut : undefined}
            nextIsOut={i < chat.messages.length - 1 ? chat.messages[i + 1].isOut : undefined}
            isGroup={chat.type === "group"}
            senderName={chat.type === "group" && !msg.isOut ? chat.name.split(" ")[0] : undefined}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji picker */}
      {showEmoji && (
        <div
          className="flex flex-wrap gap-2 px-4 py-3 border-t border-[hsl(var(--border))] animate-slide-up"
          style={{ background: "hsl(var(--header-bg))" }}
        >
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                setInput((prev) => prev + emoji);
                inputRef.current?.focus();
              }}
              className="text-2xl hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="flex items-end gap-2 px-3 py-3 border-t border-[hsl(var(--border))] flex-shrink-0"
        style={{ background: "hsl(var(--header-bg))" }}
      >
        <button
          onClick={() => { setShowAttach(!showAttach); setShowEmoji(false); }}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[hsl(var(--muted-foreground))] hover:text-white flex-shrink-0"
        >
          <Icon name="Paperclip" size={20} />
        </button>

        <div
          className="flex-1 flex items-end rounded-2xl px-4 py-2 gap-2"
          style={{ background: "hsl(var(--muted))" }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Сообщение..."
            rows={1}
            className="flex-1 bg-transparent text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none resize-none text-[15px] leading-5 max-h-32"
            style={{ minHeight: "24px" }}
          />
          <button
            onClick={() => { setShowEmoji(!showEmoji); setShowAttach(false); }}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-white transition-colors"
          >
            <Icon name="Smile" size={20} />
          </button>
        </div>

        <button
          onClick={handleSend}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 active:scale-95"
          style={{ background: input.trim() ? "var(--tg-blue)" : "hsl(var(--muted))" }}
        >
          {input.trim() ? (
            <Icon name="Send" size={18} className="text-white" />
          ) : (
            <Icon name="Mic" size={18} className="text-[hsl(var(--muted-foreground))]" />
          )}
        </button>
      </div>

      {/* Attach panel */}
      {showAttach && (
        <div
          className="flex gap-4 px-4 py-3 border-t border-[hsl(var(--border))] animate-slide-up justify-center"
          style={{ background: "hsl(var(--header-bg))" }}
        >
          {[
            { icon: "Image", label: "Фото/Видео", color: "#2AABEE" },
            { icon: "FileText", label: "Файл", color: "#9B59B6" },
            { icon: "MapPin", label: "Геопозиция", color: "#2ECC71" },
            { icon: "Contact", label: "Контакт", color: "#E67E22" },
            { icon: "Music", label: "Музыка", color: "#E74C3C" },
          ].map((item) => (
            <button key={item.label} className="flex flex-col items-center gap-1">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                style={{ background: item.color }}
              >
                <Icon name={item.icon} size={22} />
              </div>
              <span className="text-xs text-[hsl(var(--muted-foreground))]">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DateDivider({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-3 my-3">
      <div className="flex-1 h-px bg-[hsl(var(--border))]" />
      <span
        className="text-xs px-3 py-1 rounded-full text-[hsl(var(--muted-foreground))]"
        style={{ background: "hsl(var(--muted))" }}
      >
        {date}
      </span>
      <div className="flex-1 h-px bg-[hsl(var(--border))]" />
    </div>
  );
}

function MessageBubble({ message, prevIsOut, nextIsOut, isGroup, senderName }: {
  message: Message;
  prevIsOut?: boolean;
  nextIsOut?: boolean;
  isGroup?: boolean;
  senderName?: string;
}) {
  const [showReactions, setShowReactions] = useState(false);

  const isSameAsPrev = prevIsOut === message.isOut;
  const isSameAsNext = nextIsOut === message.isOut;

  return (
    <div
      className={`flex ${message.isOut ? "justify-end" : "justify-start"} animate-slide-up`}
      style={{ marginBottom: isSameAsNext ? "2px" : "8px" }}
    >
      <div
        className={`max-w-[70%] flex flex-col ${message.isOut ? "items-end" : "items-start"}`}
      >
        {isGroup && !message.isOut && !isSameAsPrev && senderName && (
          <p className="text-xs font-medium mb-1 ml-3" style={{ color: "var(--tg-blue)" }}>
            {senderName}
          </p>
        )}

        {message.forwarded && (
          <div className="flex items-center gap-1 mb-1 px-1">
            <Icon name="Forward" size={12} className="text-[hsl(var(--muted-foreground))]" />
            <span className="text-xs text-[hsl(var(--muted-foreground))]">Пересланное</span>
          </div>
        )}

        <div
          className={`px-3 py-2 ${message.isOut ? "message-bubble-out" : "message-bubble-in"} relative group cursor-pointer`}
          onClick={() => setShowReactions(!showReactions)}
        >
          {message.replyTo && (
            <div
              className="text-xs mb-2 px-2 py-1 rounded-lg border-l-2"
              style={{ borderColor: "var(--tg-blue)", background: "rgba(0,0,0,0.2)" }}
            >
              <p className="font-medium" style={{ color: "var(--tg-blue)" }}>Ответ</p>
              <p className="text-white/70 truncate">{message.replyTo}</p>
            </div>
          )}

          <div className="flex items-end gap-2">
            <p className={`text-[15px] leading-relaxed ${message.isOut ? "text-white" : "text-[hsl(var(--foreground))]"}`}>
              {message.text}
            </p>
            <div className="flex items-center gap-1 flex-shrink-0 ml-1">
              <span className={`text-[11px] ${message.isOut ? "text-white/70" : "text-[hsl(var(--muted-foreground))]"}`}>
                {message.time}
              </span>
              {message.isOut && <MessageStatus status={message.status} />}
            </div>
          </div>
        </div>

        {message.reactions && message.reactions.length > 0 && (
          <div className={`flex gap-1 mt-1 ${message.isOut ? "mr-1" : "ml-1"}`}>
            {message.reactions.map((r) => (
              <button
                key={r.emoji}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs hover:scale-110 transition-transform"
                style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}
              >
                <span>{r.emoji}</span>
                <span className="text-[hsl(var(--muted-foreground))]">{r.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MessageStatus({ status }: { status?: string }) {
  if (status === "read") {
    return (
      <span className="text-white/90">
        <Icon name="CheckCheck" size={14} />
      </span>
    );
  }
  if (status === "delivered") {
    return (
      <span className="text-white/60">
        <Icon name="CheckCheck" size={14} />
      </span>
    );
  }
  return (
    <span className="text-white/60">
      <Icon name="Check" size={14} />
    </span>
  );
}
