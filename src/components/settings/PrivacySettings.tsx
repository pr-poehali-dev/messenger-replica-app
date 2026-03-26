import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props { onBack: () => void; onLogout: () => void; }

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
      style={{ background: value ? "var(--tg-blue)" : "hsl(var(--muted))" }}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${value ? "translate-x-7" : "translate-x-1"}`} />
    </button>
  );
}

function SelectRow({ label, value, options, onChange, last }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void; last?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`relative px-4 py-3.5 ${!last ? "border-b border-[hsl(var(--border))]" : ""}`}>
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpen(!open)}>
        <p className="text-[hsl(var(--foreground))] text-[15px]">{label}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: "var(--tg-blue)" }}>{value}</span>
          <Icon name={open ? "ChevronUp" : "ChevronDown"} size={16} className="text-[hsl(var(--muted-foreground))]" />
        </div>
      </div>
      {open && (
        <div className="mt-2 flex flex-col gap-1">
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${value === opt ? "text-white" : "text-[hsl(var(--muted-foreground))] hover:text-white"}`}
              style={value === opt ? { background: "hsl(var(--primary) / 0.2)" } : {}}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PrivacySettings({ onBack, onLogout }: Props) {
  const [twoFactor, setTwoFactor] = useState(false);
  const [lastSeen, setLastSeen] = useState("Все");
  const [phone, setPhone] = useState("Мои контакты");
  const [photo, setPhoto] = useState("Все");
  const [calls, setCalls] = useState("Все");
  const [fwdMessages, setFwdMessages] = useState("Все");
  const [deleteHistory, setDeleteHistory] = useState(false);

  const visibilityOpts = ["Все", "Мои контакты", "Никто"];

  return (
    <div className="flex flex-col h-full" style={{ background: "hsl(var(--chat-bg))" }}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[hsl(var(--border))]"
        style={{ background: "hsl(var(--header-bg))" }}>
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[hsl(var(--muted-foreground))] hover:text-white">
          <Icon name="ArrowLeft" size={20} />
        </button>
        <h1 className="text-white font-semibold text-base">Конфиденциальность</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {/* Security */}
        <div className="mt-6">
          <p className="px-5 pb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Безопасность</p>
          <div className="mx-3 rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-4 px-4 py-3.5 border-b border-[hsl(var(--border))]">
              <Icon name="Lock" size={18} className="text-[hsl(var(--muted-foreground))]" />
              <div className="flex-1">
                <p className="text-[hsl(var(--foreground))] text-[15px]">Двухфакторная аутентификация</p>
                <p className="text-[hsl(var(--muted-foreground))] text-xs">Дополнительный пароль</p>
              </div>
              <Toggle value={twoFactor} onChange={setTwoFactor} />
            </div>
            <div className="flex items-center gap-4 px-4 py-3.5">
              <Icon name="Monitor" size={18} className="text-[hsl(var(--muted-foreground))]" />
              <div className="flex-1">
                <p className="text-[hsl(var(--foreground))] text-[15px]">Активные сеансы</p>
                <p className="text-[hsl(var(--muted-foreground))] text-xs">Устройства, подключённые к аккаунту</p>
              </div>
              <Icon name="ChevronRight" size={16} className="text-[hsl(var(--muted-foreground))]" />
            </div>
          </div>
        </div>

        {/* Visibility */}
        <div className="mt-6">
          <p className="px-5 pb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Видимость</p>
          <div className="mx-3 rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <SelectRow label="Время последнего визита" value={lastSeen} options={visibilityOpts} onChange={setLastSeen} />
            <SelectRow label="Номер телефона" value={phone} options={visibilityOpts} onChange={setPhone} />
            <SelectRow label="Фото профиля" value={photo} options={visibilityOpts} onChange={setPhoto} />
            <SelectRow label="Звонки" value={calls} options={visibilityOpts} onChange={setCalls} />
            <SelectRow label="Пересланные сообщения" value={fwdMessages} options={visibilityOpts} onChange={setFwdMessages} last />
          </div>
        </div>

        {/* Delete */}
        <div className="mt-6">
          <p className="px-5 pb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Данные</p>
          <div className="mx-3 rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-4 px-4 py-3.5">
              <Icon name="Trash2" size={18} className="text-[hsl(var(--muted-foreground))]" />
              <div className="flex-1">
                <p className="text-[hsl(var(--foreground))] text-[15px]">Удалять историю</p>
                <p className="text-[hsl(var(--muted-foreground))] text-xs">Авто-удаление сообщений</p>
              </div>
              <Toggle value={deleteHistory} onChange={setDeleteHistory} />
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-6 mx-3">
          <button onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-red-400 hover:text-red-300 transition-colors"
            style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <Icon name="LogOut" size={18} />
            Завершить все сеансы
          </button>
        </div>
      </div>
    </div>
  );
}
