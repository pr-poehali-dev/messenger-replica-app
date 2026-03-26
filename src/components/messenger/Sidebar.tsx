import { useState } from "react";
import Icon from "@/components/ui/icon";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: "User", label: "Мой профиль" },
  { icon: "Users", label: "Новая группа" },
  { icon: "Radio", label: "Новый канал" },
  { icon: "Bot", label: "Добавить бота" },
  { icon: "Archive", label: "Архив" },
  { icon: "Bookmark", label: "Избранное" },
  { icon: "Settings", label: "Настройки" },
  { icon: "HelpCircle", label: "Помощь" },
  { icon: "Info", label: "О приложении" },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed left-0 top-0 h-full w-72 z-50 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "hsl(var(--sidebar-bg))" }}
      >
        {/* Profile section */}
        <div
          className="p-5 pt-10 pb-4 flex flex-col gap-3"
          style={{
            background: "linear-gradient(135deg, #1a3a5c 0%, #0f2a45 100%)",
          }}
        >
          <div className="flex items-center justify-between">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{ background: "var(--tg-blue)" }}
            >
              ВП
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              <Icon name={darkMode ? "Moon" : "Sun"} size={18} />
            </button>
          </div>
          <div>
            <p className="text-white font-semibold text-base">Ваш Профиль</p>
            <p className="text-white/60 text-sm">+7 900 000-00-00</p>
          </div>
        </div>

        {/* Menu items */}
        <div className="flex-1 overflow-y-auto py-2">
          {menuItems.map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-white/5 group"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="w-6 h-6 flex items-center justify-center text-[hsl(var(--muted-foreground))] group-hover:text-[var(--tg-blue)] transition-colors">
                <Icon name={item.icon} size={20} />
              </div>
              <span className="text-[hsl(var(--foreground))] text-[15px] font-medium">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Version */}
        <div className="p-4 border-t border-white/5">
          <p className="text-[hsl(var(--muted-foreground))] text-xs text-center">
            Волна v1.0.0
          </p>
        </div>
      </div>
    </>
  );
}
