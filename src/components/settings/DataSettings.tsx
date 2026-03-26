import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props { onBack: () => void; }

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
      style={{ background: value ? "var(--tg-blue)" : "hsl(var(--muted))" }}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${value ? "translate-x-7" : "translate-x-1"}`} />
    </button>
  );
}

const autoDownloadOptions = ["Никогда", "Wi-Fi", "Wi-Fi и данные", "Всегда"];

export default function DataSettings({ onBack }: Props) {
  const [photoWifi, setPhotoWifi] = useState(true);
  const [videoWifi, setVideoWifi] = useState(false);
  const [fileWifi, setFileWifi] = useState(false);
  const [proxy, setProxy] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);

  const storageItems = [
    { label: "Фотографии", size: "128 МБ", color: "#2AABEE", pct: 45 },
    { label: "Видео", size: "64 МБ", color: "#9B59B6", pct: 22 },
    { label: "Документы", size: "32 МБ", color: "#E67E22", pct: 11 },
    { label: "Другое", size: "64 МБ", color: "#607D8B", pct: 22 },
  ];
  const total = "288 МБ";

  return (
    <div className="flex flex-col h-full" style={{ background: "hsl(var(--chat-bg))" }}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[hsl(var(--border))]"
        style={{ background: "hsl(var(--header-bg))" }}>
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[hsl(var(--muted-foreground))] hover:text-white">
          <Icon name="ArrowLeft" size={20} />
        </button>
        <h1 className="text-white font-semibold text-base">Данные и хранилище</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {/* Storage */}
        <div className="mt-6">
          <p className="px-5 pb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Использование памяти</p>
          <div className="mx-3 rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex h-4 rounded-full overflow-hidden gap-0.5 mb-4">
              {storageItems.map(item => (
                <div key={item.label} style={{ width: `${item.pct}%`, background: item.color }} />
              ))}
            </div>
            {storageItems.map(item => (
              <div key={item.label} className="flex items-center gap-3 py-1.5">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: item.color }} />
                <p className="flex-1 text-[hsl(var(--foreground))] text-sm">{item.label}</p>
                <p className="text-[hsl(var(--muted-foreground))] text-sm">{item.size}</p>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t border-[hsl(var(--border))] flex items-center justify-between">
              <p className="text-[hsl(var(--foreground))] font-medium text-sm">Итого</p>
              <p className="text-[hsl(var(--foreground))] font-medium text-sm">{total}</p>
            </div>
            <button className="mt-3 w-full py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ background: "hsl(var(--destructive) / 0.15)", color: "hsl(var(--destructive))", border: "1px solid hsl(var(--destructive) / 0.3)" }}>
              Очистить кэш
            </button>
          </div>
        </div>

        {/* Auto-download */}
        <div className="mt-6">
          <p className="px-5 pb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Авто-загрузка медиа</p>
          <div className="mx-3 rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-4 px-4 py-3.5 border-b border-[hsl(var(--border))]">
              <Icon name="Image" size={18} className="text-[hsl(var(--muted-foreground))]" />
              <p className="flex-1 text-[hsl(var(--foreground))] text-[15px]">Фотографии по Wi-Fi</p>
              <Toggle value={photoWifi} onChange={setPhotoWifi} />
            </div>
            <div className="flex items-center gap-4 px-4 py-3.5 border-b border-[hsl(var(--border))]">
              <Icon name="Video" size={18} className="text-[hsl(var(--muted-foreground))]" />
              <p className="flex-1 text-[hsl(var(--foreground))] text-[15px]">Видео по Wi-Fi</p>
              <Toggle value={videoWifi} onChange={setVideoWifi} />
            </div>
            <div className="flex items-center gap-4 px-4 py-3.5">
              <Icon name="FileText" size={18} className="text-[hsl(var(--muted-foreground))]" />
              <p className="flex-1 text-[hsl(var(--foreground))] text-[15px]">Файлы по Wi-Fi</p>
              <Toggle value={fileWifi} onChange={setFileWifi} />
            </div>
          </div>
        </div>

        {/* Network */}
        <div className="mt-6">
          <p className="px-5 pb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Сеть</p>
          <div className="mx-3 rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-4 px-4 py-3.5 border-b border-[hsl(var(--border))]">
              <Icon name="Globe" size={18} className="text-[hsl(var(--muted-foreground))]" />
              <div className="flex-1">
                <p className="text-[hsl(var(--foreground))] text-[15px]">Прокси</p>
                <p className="text-[hsl(var(--muted-foreground))] text-xs">Использовать прокси-сервер</p>
              </div>
              <Toggle value={proxy} onChange={setProxy} />
            </div>
            <div className="flex items-center gap-4 px-4 py-3.5">
              <Icon name="CheckCheck" size={18} className="text-[hsl(var(--muted-foreground))]" />
              <div className="flex-1">
                <p className="text-[hsl(var(--foreground))] text-[15px]">Статус прочтения</p>
                <p className="text-[hsl(var(--muted-foreground))] text-xs">Показывать «прочитано» собеседнику</p>
              </div>
              <Toggle value={readReceipts} onChange={setReadReceipts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
