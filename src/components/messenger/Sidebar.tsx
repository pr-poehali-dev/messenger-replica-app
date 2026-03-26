import Icon from "@/components/ui/icon";
import { AuthUser } from "@/api/authApi";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
  onLogout: () => void;
  onOpenSettings: () => void;
}

const menuItems = [
  { icon: "Users", label: "Новая группа" },
  { icon: "Radio", label: "Новый канал" },
  { icon: "Bot", label: "Добавить бота" },
  { icon: "Archive", label: "Архив" },
  { icon: "Bookmark", label: "Избранное" },
  { icon: "HelpCircle", label: "Помощь" },
];

export default function Sidebar({ isOpen, onClose, user, onLogout, onOpenSettings }: SidebarProps) {
  const initials = user?.avatar_initials || (user?.display_name?.slice(0, 2).toUpperCase() ?? "??");

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      )}

      <div
        className={`fixed left-0 top-0 h-full w-72 z-50 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "hsl(var(--sidebar-bg))" }}
      >
        {/* Profile */}
        <button
          onClick={() => { onOpenSettings(); onClose(); }}
          className="p-5 pt-10 pb-4 flex flex-col gap-3 text-left hover:brightness-110 transition-all"
          style={{ background: "linear-gradient(135deg, #1a3a5c 0%, #0f2a45 100%)" }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
              style={{ background: "hsl(222 18% 28%)" }}>
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white font-semibold text-base truncate">{user?.display_name || "Профиль"}</p>
              <p className="text-white/60 text-sm truncate">
                {user?.username ? `@${user.username}` : user?.phone || ""}
              </p>
            </div>
            <Icon name="ChevronRight" size={16} className="text-white/40 flex-shrink-0" />
          </div>
        </button>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-2">
          {/* Settings — выделенный пункт */}
          <button
            onClick={() => { onOpenSettings(); onClose(); }}
            className="w-full flex items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-white/5 group"
          >
            <div className="w-6 h-6 flex items-center justify-center text-[hsl(var(--muted-foreground))] group-hover:text-[var(--tg-blue)] transition-colors">
              <Icon name="Settings" size={20} />
            </div>
            <span className="text-[hsl(var(--foreground))] text-[15px] font-medium">Настройки</span>
          </button>

          <div className="my-1 border-t border-white/5" />

          {menuItems.map((item, i) => (
            <button key={i}
              className="w-full flex items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-white/5 group">
              <div className="w-6 h-6 flex items-center justify-center text-[hsl(var(--muted-foreground))] group-hover:text-[var(--tg-blue)] transition-colors">
                <Icon name={item.icon} size={20} />
              </div>
              <span className="text-[hsl(var(--foreground))] text-[15px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Logout + Version */}
        <div className="border-t border-white/5">
          <button onClick={onLogout}
            className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors group">
            <div className="w-6 h-6 flex items-center justify-center text-red-400 group-hover:text-red-300 transition-colors">
              <Icon name="LogOut" size={20} />
            </div>
            <span className="text-red-400 group-hover:text-red-300 text-[15px] font-medium transition-colors">Выйти</span>
          </button>
          <p className="text-[hsl(var(--muted-foreground))] text-xs text-center py-3">Мини v1.0.0</p>
        </div>
      </div>
    </>
  );
}
