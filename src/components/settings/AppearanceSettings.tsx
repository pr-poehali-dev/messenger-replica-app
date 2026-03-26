import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props { onBack: () => void; }

const themes = [
  { id: "dark", label: "Тёмная", colors: ["#1a1f2e", "#2AABEE"] },
  { id: "darker", label: "Ночная", colors: ["#0d1117", "#2AABEE"] },
  { id: "blue", label: "Морская", colors: ["#0f1e3d", "#4A9EFF"] },
];

const textSizes = ["Маленький", "Средний", "Большой", "Очень большой"];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
      style={{ background: value ? "var(--tg-blue)" : "hsl(var(--muted))" }}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${value ? "translate-x-7" : "translate-x-1"}`} />
    </button>
  );
}

export default function AppearanceSettings({ onBack }: Props) {
  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [textSize, setTextSize] = useState(1);
  const [animations, setAnimations] = useState(true);
  const [sendByEnter, setSendByEnter] = useState(true);
  const [bubbleStyle, setBubbleStyle] = useState("rounded");

  return (
    <div className="flex flex-col h-full" style={{ background: "hsl(var(--chat-bg))" }}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[hsl(var(--border))]"
        style={{ background: "hsl(var(--header-bg))" }}>
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-[hsl(var(--muted-foreground))] hover:text-white">
          <Icon name="ArrowLeft" size={20} />
        </button>
        <h1 className="text-white font-semibold text-base">Внешний вид</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {/* Preview */}
        <div className="mx-4 mt-5 p-4 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mb-3 text-center">Предпросмотр</p>
          <div className="flex flex-col gap-2">
            <div className="self-start px-3 py-2 rounded-2xl rounded-bl-sm max-w-[75%]" style={{ background: "hsl(var(--bubble-in))" }}>
              <p className="text-[hsl(var(--foreground))] text-sm">Привет! Как дела? 👋</p>
              <p className="text-[hsl(var(--muted-foreground))] text-xs text-right mt-0.5">12:00</p>
            </div>
            <div className="self-end px-3 py-2 rounded-2xl rounded-br-sm max-w-[75%]" style={{ background: "var(--tg-blue)" }}>
              <p className="text-white text-sm">Отлично, спасибо! 😊</p>
              <p className="text-white/70 text-xs text-right mt-0.5">12:01 ✓✓</p>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="mt-6">
          <p className="px-5 pb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Тема</p>
          <div className="flex gap-3 px-4">
            {themes.map(t => (
              <button key={t.id} onClick={() => setSelectedTheme(t.id)}
                className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full aspect-square rounded-xl overflow-hidden relative border-2 transition-colors"
                  style={{
                    background: t.colors[0],
                    borderColor: selectedTheme === t.id ? "var(--tg-blue)" : "hsl(var(--border))"
                  }}>
                  <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full" style={{ background: t.colors[1] }} />
                  {selectedTheme === t.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Icon name="Check" size={20} className="text-white" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{t.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Text size */}
        <div className="mt-6">
          <p className="px-5 pb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Размер текста</p>
          <div className="mx-3 rounded-xl px-4 py-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs text-[hsl(var(--muted-foreground))]">А</span>
              <input type="range" min={0} max={3} value={textSize} onChange={e => setTextSize(+e.target.value)}
                className="flex-1 accent-[#2AABEE]" />
              <span className="text-lg text-[hsl(var(--muted-foreground))]">А</span>
            </div>
            <p className="text-center text-[hsl(var(--muted-foreground))] text-sm">{textSizes[textSize]}</p>
          </div>
        </div>

        {/* Options */}
        <div className="mt-6">
          <p className="px-5 pb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Интерфейс</p>
          <div className="mx-3 rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-4 px-4 py-3.5 border-b border-[hsl(var(--border))]">
              <Icon name="Zap" size={18} className="text-[hsl(var(--muted-foreground))]" />
              <div className="flex-1">
                <p className="text-[hsl(var(--foreground))] text-[15px]">Анимации</p>
                <p className="text-[hsl(var(--muted-foreground))] text-xs">Плавные переходы</p>
              </div>
              <Toggle value={animations} onChange={setAnimations} />
            </div>
            <div className="flex items-center gap-4 px-4 py-3.5 border-b border-[hsl(var(--border))]">
              <Icon name="Send" size={18} className="text-[hsl(var(--muted-foreground))]" />
              <div className="flex-1">
                <p className="text-[hsl(var(--foreground))] text-[15px]">Enter для отправки</p>
                <p className="text-[hsl(var(--muted-foreground))] text-xs">Shift+Enter — перенос строки</p>
              </div>
              <Toggle value={sendByEnter} onChange={setSendByEnter} />
            </div>
            <div className="flex items-center gap-4 px-4 py-3.5">
              <Icon name="MessageSquare" size={18} className="text-[hsl(var(--muted-foreground))]" />
              <div className="flex-1">
                <p className="text-[hsl(var(--foreground))] text-[15px]">Стиль пузырей</p>
              </div>
              <div className="flex gap-2">
                {["rounded", "square"].map(s => (
                  <button key={s} onClick={() => setBubbleStyle(s)}
                    className="px-3 py-1 rounded-full text-xs transition-colors"
                    style={{
                      background: bubbleStyle === s ? "var(--tg-blue)" : "hsl(var(--muted))",
                      color: bubbleStyle === s ? "white" : "hsl(var(--muted-foreground))"
                    }}>
                    {s === "rounded" ? "Круглые" : "Квадратные"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
