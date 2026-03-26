import { useState } from "react";
import { AuthUser } from "@/api/authApi";
import Icon from "@/components/ui/icon";
import ProfileSettings from "./ProfileSettings";
import NotificationsSettings from "./NotificationsSettings";
import PrivacySettings from "./PrivacySettings";
import AppearanceSettings from "./AppearanceSettings";
import DataSettings from "./DataSettings";

interface SettingsScreenProps {
  user: AuthUser;
  onClose: () => void;
  onUserUpdate: (user: AuthUser) => void;
  onLogout: () => void;
}

type Section = null | "profile" | "notifications" | "privacy" | "appearance" | "data";

const sections = [
  {
    items: [
      { id: "profile", icon: "User", label: "Мой профиль", sub: "Имя, фото, bio, username" },
    ]
  },
  {
    title: "Настройки",
    items: [
      { id: "notifications", icon: "Bell", label: "Уведомления и звуки", sub: "Сообщения, группы, каналы" },
      { id: "privacy", icon: "Shield", label: "Конфиденциальность", sub: "Блокировка, сеансы" },
      { id: "appearance", icon: "Palette", label: "Внешний вид", sub: "Тема, размер текста" },
      { id: "data", icon: "HardDrive", label: "Данные и хранилище", sub: "Авто-загрузка медиа" },
    ]
  },
  {
    title: "Поддержка",
    items: [
      { id: "help", icon: "HelpCircle", label: "Помощь", sub: "FAQ и поддержка" },
      { id: "about", icon: "Info", label: "О приложении", sub: "Мини v1.0.0" },
    ]
  }
];

export default function SettingsScreen({ user, onClose, onUserUpdate, onLogout }: SettingsScreenProps) {
  const [section, setSection] = useState<Section>(null);

  if (section === "profile") return <ProfileSettings user={user} onBack={() => setSection(null)} onUpdate={onUserUpdate} />;
  if (section === "notifications") return <NotificationsSettings onBack={() => setSection(null)} />;
  if (section === "privacy") return <PrivacySettings onBack={() => setSection(null)} onLogout={onLogout} />;
  if (section === "appearance") return <AppearanceSettings onBack={() => setSection(null)} />;
  if (section === "data") return <DataSettings onBack={() => setSection(null)} />;

  const initials = user.avatar_initials || user.display_name.slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col h-full" style={{ background: "hsl(var(--chat-bg))" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[hsl(var(--border))] flex-shrink-0"
        style={{ background: "hsl(var(--header-bg))" }}>
        <button onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[hsl(var(--muted-foreground))] hover:text-white">
          <Icon name="ArrowLeft" size={20} />
        </button>
        <h1 className="text-white font-semibold text-base flex-1">Настройки</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile card */}
        <button
          onClick={() => setSection("profile")}
          className="w-full flex items-center gap-4 px-5 py-5 hover:bg-white/5 transition-colors border-b border-[hsl(var(--border))]"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
            style={{ background: "var(--tg-blue)" }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-white font-semibold text-lg truncate">{user.display_name}</p>
            {user.username && <p className="text-sm truncate" style={{ color: "var(--tg-blue)" }}>@{user.username}</p>}
            <p className="text-[hsl(var(--muted-foreground))] text-sm truncate">{user.phone}</p>
          </div>
          <Icon name="ChevronRight" size={18} className="text-[hsl(var(--muted-foreground))] flex-shrink-0" />
        </button>

        {/* Sections */}
        {sections.map((group, gi) => (
          <div key={gi} className="mt-6">
            {group.title && (
              <p className="px-5 pb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                {group.title}
              </p>
            )}
            <div className="rounded-xl mx-3 overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              {group.items.map((item, ii) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "help" || item.id === "about") return;
                    setSection(item.id as Section);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 hover:bg-white/5 transition-colors text-left ${
                    ii < group.items.length - 1 ? "border-b border-[hsl(var(--border))]" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: getIconBg(item.id) }}>
                    <Icon name={item.icon} size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[hsl(var(--foreground))] font-medium text-[15px]">{item.label}</p>
                    <p className="text-[hsl(var(--muted-foreground))] text-xs truncate">{item.sub}</p>
                  </div>
                  <Icon name="ChevronRight" size={16} className="text-[hsl(var(--muted-foreground))] flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <div className="mt-6 mx-3 mb-8">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-red-400 hover:text-red-300 transition-colors"
            style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
          >
            <Icon name="LogOut" size={18} />
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}

function getIconBg(id: string): string {
  const map: Record<string, string> = {
    profile: "#2AABEE",
    notifications: "#FF9500",
    privacy: "#4CAF50",
    appearance: "#9B59B6",
    data: "#607D8B",
    help: "#2AABEE",
    about: "#607D8B",
  };
  return map[id] || "#607D8B";
}
