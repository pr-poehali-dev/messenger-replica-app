import { useState } from "react";
import { Chat } from "@/data/mockData";
import Avatar from "./Avatar";
import Icon from "@/components/ui/icon";

interface ChatListProps {
  chats: Chat[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onMenuOpen: () => void;
  onNewChat: () => void;
}

const tabs = ["Все", "Личные", "Группы", "Каналы"];

export default function ChatList({ chats, selectedId, onSelect, onMenuOpen, onNewChat }: ChatListProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Все");

  const filtered = chats.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      activeTab === "Все" ||
      (activeTab === "Личные" && (c.type === "personal" || c.type === "bot")) ||
      (activeTab === "Группы" && c.type === "group") ||
      (activeTab === "Каналы" && c.type === "channel");
    return matchSearch && matchTab;
  });

  return (
    <div
      className="flex flex-col h-full border-r border-[hsl(var(--border))]"
      style={{ background: "hsl(var(--sidebar-bg))", width: "340px", minWidth: "340px" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b border-[hsl(var(--border))]"
        style={{ background: "hsl(var(--header-bg))" }}
      >
        <button
          onClick={onMenuOpen}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[hsl(var(--muted-foreground))] hover:text-white"
        >
          <Icon name="Menu" size={20} />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <svg viewBox="0 0 100 100" width="26" height="26" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hdr-logo" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2AABEE"/>
                <stop offset="100%" stopColor="#1A6FA8"/>
              </linearGradient>
            </defs>
            <rect width="100" height="100" rx="22" fill="url(#hdr-logo)"/>
            <path d="M18 50 L82 22 L58 78 L48 58 Z" fill="white" opacity="0.95"/>
            <path d="M48 58 L82 22 L55 65 Z" fill="white" opacity="0.6"/>
          </svg>
          <h1 className="text-white font-semibold text-lg">Мини</h1>
        </div>
        <button
          onClick={onNewChat}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[hsl(var(--muted-foreground))] hover:text-white"
          title="Новый чат"
        >
          <Icon name="Edit" size={18} />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "hsl(var(--muted))" }}>
          <Icon name="Search" size={16} className="text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="Поиск"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-[hsl(var(--muted-foreground))] hover:text-white">
              <Icon name="X" size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-3 gap-1 pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === tab
                ? "text-white"
                : "text-[hsl(var(--muted-foreground))] hover:text-white hover:bg-white/5"
            }`}
            style={activeTab === tab ? { background: "var(--tg-blue)" } : {}}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((chat, i) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isSelected={selectedId === chat.id}
            onSelect={() => onSelect(chat.id)}
            index={i}
          />
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[hsl(var(--muted-foreground))]">
            <Icon name="Search" size={40} />
            <p className="mt-3 text-sm">Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatItem({ chat, isSelected, onSelect, index }: {
  chat: Chat;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) {
  return (
    <div
      onClick={onSelect}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer chat-item-hover animate-fade-in ${
        isSelected ? "chat-item-active" : ""
      }`}
      style={{ animationDelay: `${index * 20}ms` }}
    >
      <Avatar name={chat.avatar} online={chat.online} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 min-w-0">
            {chat.type === "channel" && (
              <Icon name="Radio" size={13} className="flex-shrink-0 text-[hsl(var(--muted-foreground))]" />
            )}
            {chat.type === "bot" && (
              <Icon name="Bot" size={13} className="flex-shrink-0 text-[hsl(var(--muted-foreground))]" />
            )}
            {chat.verified && (
              <Icon name="BadgeCheck" size={14} className="flex-shrink-0" style={{ color: "var(--tg-blue)" }} />
            )}
            <p className="text-[hsl(var(--foreground))] font-medium text-[15px] truncate">
              {chat.name}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {chat.muted && (
              <Icon name="BellOff" size={12} className="text-[hsl(var(--muted-foreground))]" />
            )}
            <span className="text-[hsl(var(--muted-foreground))] text-xs">{chat.time}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-[hsl(var(--muted-foreground))] text-sm truncate flex-1">
            {chat.lastMessage}
          </p>
          {chat.unread > 0 && !chat.muted && (
            <span
              className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center text-white text-xs font-medium"
              style={{ background: "var(--tg-blue)" }}
            >
              {chat.unread > 99 ? "99+" : chat.unread}
            </span>
          )}
          {chat.unread > 0 && chat.muted && (
            <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center text-xs font-medium bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}