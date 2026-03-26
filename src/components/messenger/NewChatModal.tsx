import { useState, useEffect, useRef } from "react";
import { searchUsers, startChat, FoundUser } from "@/api/contactsApi";
import Avatar from "./Avatar";
import Icon from "@/components/ui/icon";

interface NewChatModalProps {
  onClose: () => void;
  onChatCreated: (chatId: number) => void;
}

export default function NewChatModal({ onClose, onChatCreated }: NewChatModalProps) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<FoundUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) { setUsers([]); return; }
    if (timer.current) clearTimeout(timer.current);
    setLoading(true);
    timer.current = setTimeout(async () => {
      const res = await searchUsers(query);
      setUsers(res);
      setLoading(false);
    }, 400);
  }, [query]);

  const handleStart = async (user: FoundUser) => {
    setCreating(user.id);
    const res = await startChat(user.id);
    setCreating(null);
    if (res.ok && res.chat_id) {
      onChatCreated(res.chat_id);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-2xl flex flex-col overflow-hidden animate-scale-in"
        style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", maxHeight: "80vh" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[hsl(var(--border))]">
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[hsl(var(--muted-foreground))] hover:text-white">
            <Icon name="ArrowLeft" size={20} />
          </button>
          <h2 className="text-white font-semibold text-base flex-1">Новый чат</h2>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-[hsl(var(--border))]">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ background: "hsl(var(--muted))" }}>
            <Icon name="Search" size={16} className="text-[hsl(var(--muted-foreground))]" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Поиск по @username или имени"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder:text-[hsl(var(--muted-foreground))] outline-none text-sm"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-[hsl(var(--muted-foreground))] hover:text-white">
                <Icon name="X" size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 rounded-full border-2 animate-spin"
                style={{ borderColor: "var(--tg-blue)", borderTopColor: "transparent" }} />
            </div>
          )}

          {!loading && query && users.length === 0 && (
            <div className="flex flex-col items-center py-10 gap-2 text-[hsl(var(--muted-foreground))]">
              <Icon name="UserX" size={36} />
              <p className="text-sm">Пользователь не найден</p>
              <p className="text-xs text-center px-6">Попробуйте ввести точный @username</p>
            </div>
          )}

          {!loading && !query && (
            <div className="flex flex-col items-center py-10 gap-2 text-[hsl(var(--muted-foreground))]">
              <Icon name="AtSign" size={36} />
              <p className="text-sm">Введите @username для поиска</p>
            </div>
          )}

          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleStart(user)}
              disabled={creating === user.id}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
            >
              <Avatar name={user.avatar_initials || user.display_name.slice(0, 2)} />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-[15px] truncate">{user.display_name}</p>
                <p className="text-[hsl(var(--muted-foreground))] text-sm truncate">@{user.username}</p>
              </div>
              {creating === user.id ? (
                <div className="w-5 h-5 rounded-full border-2 animate-spin flex-shrink-0"
                  style={{ borderColor: "var(--tg-blue)", borderTopColor: "transparent" }} />
              ) : (
                <Icon name="MessageCircle" size={18} className="text-[hsl(var(--muted-foreground))] flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
