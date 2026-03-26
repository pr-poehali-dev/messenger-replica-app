import { useState } from "react";
import { sendCode, verifyCode, saveToken, AuthUser } from "@/api/authApi";
import Icon from "@/components/ui/icon";

interface AuthScreenProps {
  onAuth: (user: AuthUser) => void;
}

type Step = "phone" | "code" | "name";

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [isNew, setIsNew] = useState(false);

  const handlePhoneSubmit = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    setError("");
    const res = await sendCode(phone);
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setDemoCode(res.demo_code || "");
      setStep("code");
    }
  };

  const handleCodeSubmit = async () => {
    if (code.length < 4) return;
    setLoading(true);
    setError("");
    const res = await verifyCode(phone, code);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    if (res.is_new) {
      setIsNew(true);
      setStep("name");
    } else if (res.token && res.user) {
      saveToken(res.token);
      onAuth(res.user);
    }
  };

  const handleNameSubmit = async () => {
    setLoading(true);
    setError("");
    const res = await verifyCode(phone, code, name || "Пользователь");
    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    if (res.token && res.user) {
      saveToken(res.token);
      onAuth(res.user);
    }
  };

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (!digits) return "";
    let formatted = "+";
    if (digits.startsWith("7") || digits.startsWith("8")) {
      const d = digits.startsWith("8") ? "7" + digits.slice(1) : digits;
      formatted = "+" + d.slice(0, 1);
      if (d.length > 1) formatted += " (" + d.slice(1, 4);
      if (d.length > 4) formatted += ") " + d.slice(4, 7);
      if (d.length > 7) formatted += "-" + d.slice(7, 9);
      if (d.length > 9) formatted += "-" + d.slice(9, 11);
    } else {
      formatted = "+" + digits.slice(0, 14);
    }
    return formatted;
  };

  return (
    <div
      className="flex h-screen w-screen items-center justify-center p-4"
      style={{ background: "hsl(var(--chat-bg))" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center gap-6 animate-scale-in"
        style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold"
            style={{ background: "linear-gradient(135deg, var(--tg-blue), #1a6fa8)" }}
          >
            В
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Волна</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              {step === "phone" && "Введите номер телефона"}
              {step === "code" && "Введите код подтверждения"}
              {step === "name" && "Как вас зовут?"}
            </p>
          </div>
        </div>

        {/* Step: Phone */}
        {step === "phone" && (
          <div className="w-full flex flex-col gap-4 animate-fade-in">
            <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
              Мы отправим вам код для входа
            </p>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}
            >
              <Icon name="Phone" size={18} className="text-[hsl(var(--muted-foreground))]" />
              <input
                type="tel"
                placeholder="+7 (999) 000-00-00"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && handlePhoneSubmit()}
                className="flex-1 bg-transparent text-white placeholder:text-[hsl(var(--muted-foreground))] outline-none text-[15px]"
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              onClick={handlePhoneSubmit}
              disabled={loading || !phone.trim()}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ background: "var(--tg-blue)" }}
            >
              {loading ? "Отправка..." : "Продолжить"}
            </button>
          </div>
        )}

        {/* Step: Code */}
        {step === "code" && (
          <div className="w-full flex flex-col gap-4 animate-fade-in">
            <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
              Код отправлен на <span className="text-white font-medium">{phone}</span>
            </p>
            {demoCode && (
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
                style={{ background: "hsl(var(--primary) / 0.15)", border: "1px solid hsl(var(--primary) / 0.3)" }}
              >
                <Icon name="Info" size={16} style={{ color: "var(--tg-blue)" }} />
                <span className="text-[hsl(var(--foreground))]">
                  Демо-код: <strong>{demoCode}</strong>
                </span>
              </div>
            )}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}
            >
              <Icon name="KeyRound" size={18} className="text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                inputMode="numeric"
                placeholder="12345"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && handleCodeSubmit()}
                className="flex-1 bg-transparent text-white placeholder:text-[hsl(var(--muted-foreground))] outline-none text-[15px] tracking-widest"
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              onClick={handleCodeSubmit}
              disabled={loading || code.length < 4}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ background: "var(--tg-blue)" }}
            >
              {loading ? "Проверка..." : "Войти"}
            </button>
            <button
              onClick={() => { setStep("phone"); setCode(""); setError(""); }}
              className="text-sm text-[hsl(var(--muted-foreground))] hover:text-white transition-colors text-center"
            >
              ← Изменить номер
            </button>
          </div>
        )}

        {/* Step: Name (new user) */}
        {step === "name" && (
          <div className="w-full flex flex-col gap-4 animate-fade-in">
            <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
              Первый вход! Как вас зовут?
            </p>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}
            >
              <Icon name="User" size={18} className="text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                className="flex-1 bg-transparent text-white placeholder:text-[hsl(var(--muted-foreground))] outline-none text-[15px]"
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              onClick={handleNameSubmit}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ background: "var(--tg-blue)" }}
            >
              {loading ? "Сохранение..." : "Начать общение"}
            </button>
          </div>
        )}

        <p className="text-xs text-[hsl(var(--muted-foreground))] text-center">
          Продолжая, вы соглашаетесь с условиями использования
        </p>
      </div>
    </div>
  );
}
