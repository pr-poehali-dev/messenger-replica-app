import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props { onBack: () => void; }

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
      style={{ background: value ? "var(--tg-blue)" : "hsl(var(--muted))" }}
    >
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${value ? "translate-x-7" : "translate-x-1"}`} />
    </button>
  );
}

function SettingsGroup({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      {title && <p className="px-5 pb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">{title}</p>}
      <div className="mx-3 rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        {children}
      </div>
    </div>
  );
}

function SettingsRow({ icon, label, sub, value, onChange, last }: {
  icon?: string; label: string; sub?: string; value?: boolean; onChange?: (v: boolean) => void; last?: boolean;
}) {
  return (
    <div className={`flex items-center gap-4 px-4 py-3.5 ${!last ? "border-b border-[hsl(var(--border))]" : ""}`}>
      {icon && <Icon name={icon} size={18} className="text-[hsl(var(--muted-foreground))] flex-shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-[hsl(var(--foreground))] text-[15px]">{label}</p>
        {sub && <p className="text-[hsl(var(--muted-foreground))] text-xs">{sub}</p>}
      </div>
      {value !== undefined && onChange && <Toggle value={value} onChange={onChange} />}
    </div>
  );
}

export default function NotificationsSettings({ onBack }: Props) {
  const [msgs, setMsgs] = useState(true);
  const [groups, setGroups] = useState(true);
  const [channels, setChannels] = useState(false);
  const [sound, setSound] = useState(true);
  const [vibro, setVibro] = useState(true);
  const [preview, setPreview] = useState(true);
  const [badge, setBadge] = useState(true);

  return (
    <div className="flex flex-col h-full" style={{ background: "hsl(var(--chat-bg))" }}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[hsl(var(--border))]"
        style={{ background: "hsl(var(--header-bg))" }}>
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[hsl(var(--muted-foreground))] hover:text-white">
          <Icon name="ArrowLeft" size={20} />
        </button>
        <h1 className="text-white font-semibold text-base">Уведомления и звуки</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        <SettingsGroup title="Личные сообщения">
          <SettingsRow icon="MessageCircle" label="Уведомления" value={msgs} onChange={setMsgs} />
          <SettingsRow icon="Volume2" label="Звук" value={sound} onChange={setSound} last />
        </SettingsGroup>

        <SettingsGroup title="Группы">
          <SettingsRow icon="Users" label="Уведомления от групп" value={groups} onChange={setGroups} last />
        </SettingsGroup>

        <SettingsGroup title="Каналы">
          <SettingsRow icon="Radio" label="Уведомления от каналов" value={channels} onChange={setChannels} last />
        </SettingsGroup>

        <SettingsGroup title="Общие">
          <SettingsRow icon="Vibrate" label="Вибрация" value={vibro} onChange={setVibro} />
          <SettingsRow icon="Eye" label="Предпросмотр сообщений" sub="Показывать текст в уведомлении" value={preview} onChange={setPreview} />
          <SettingsRow icon="Hash" label="Счётчик непрочитанных" value={badge} onChange={setBadge} last />
        </SettingsGroup>
      </div>
    </div>
  );
}
