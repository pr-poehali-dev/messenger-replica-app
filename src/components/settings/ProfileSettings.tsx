import { useState } from "react";
import { AuthUser, authHeaders } from "@/api/authApi";
import Icon from "@/components/ui/icon";

const AUTH_URL = 'https://functions.poehali.dev/5bfea82b-0665-43a1-b3b9-96d1949bdd8f';

interface Props {
  user: AuthUser;
  onBack: () => void;
  onUpdate: (user: AuthUser) => void;
}

export default function ProfileSettings({ user, onBack, onUpdate }: Props) {
  const [name, setName] = useState(user.display_name);
  const [username, setUsername] = useState(user.username || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const initials = user.avatar_initials || user.display_name.slice(0, 2).toUpperCase();

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true); setError("");
    try {
      const res = await fetch(AUTH_URL, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ action: 'set_username', username: username.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setSaving(false); return; }
      if (data.user) {
        onUpdate({ ...user, ...data.user, display_name: name });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      setError("Ошибка соединения");
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "hsl(var(--chat-bg))" }}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[hsl(var(--border))]"
        style={{ background: "hsl(var(--header-bg))" }}>
        <button onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[hsl(var(--muted-foreground))] hover:text-white">
          <Icon name="ArrowLeft" size={20} />
        </button>
        <h1 className="text-white font-semibold text-base flex-1">Мой профиль</h1>
        <button onClick={handleSave} disabled={saving}
          className="text-sm font-semibold transition-colors disabled:opacity-50"
          style={{ color: "var(--tg-blue)" }}>
          {saving ? "Сохранение..." : saved ? "✓ Сохранено" : "Сохранить"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Avatar */}
        <div className="flex flex-col items-center py-8 gap-3">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl relative"
            style={{ background: "var(--tg-blue)" }}>
            {initials}
            <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
              <Icon name="Camera" size={24} className="text-white" />
            </div>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Нажмите для смены фото</p>
        </div>

        {/* Fields */}
        <div className="px-4 flex flex-col gap-4">
          <div className="rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="px-4 pt-3 pb-1">
              <p className="text-xs font-medium mb-1" style={{ color: "var(--tg-blue)" }}>Имя</p>
              <input value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-transparent text-[hsl(var(--foreground))] text-[15px] outline-none pb-2"
                placeholder="Ваше имя" />
            </div>
            <div className="border-t border-[hsl(var(--border))] px-4 pt-3 pb-1">
              <p className="text-xs font-medium mb-1" style={{ color: "var(--tg-blue)" }}>Username</p>
              <div className="flex items-center gap-1 pb-2">
                <span className="text-[hsl(var(--muted-foreground))]">@</span>
                <input value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  className="flex-1 bg-transparent text-[hsl(var(--foreground))] text-[15px] outline-none"
                  placeholder="username" maxLength={32} />
              </div>
            </div>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))] px-1">
            Username должен содержать только латинские буквы, цифры и _, не менее 3 символов.
          </p>

          {/* Phone */}
          <div className="rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="px-4 py-3">
              <p className="text-xs font-medium mb-1" style={{ color: "var(--tg-blue)" }}>Телефон</p>
              <p className="text-[hsl(var(--foreground))] text-[15px]">{user.phone}</p>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}
