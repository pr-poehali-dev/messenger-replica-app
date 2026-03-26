import { useState, useEffect, useRef } from "react";
import { sendCode, verifyCode, saveToken, AuthUser } from "@/api/authApi";
import { checkUsername } from "@/api/contactsApi";
import Icon from "@/components/ui/icon";

interface AuthScreenProps {
  onAuth: (user: AuthUser) => void;
}

type Step = "phone" | "code" | "name" | "username";

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "ok" | "taken" | "invalid">("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const checkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Дебаунс проверки username
  useEffect(() => {
    if (!username) { setUsernameStatus("idle"); return; }
    if (!/^[a-z0-9_]{3,32}$/.test(username)) { setUsernameStatus("invalid"); return; }
    setUsernameStatus("checking");
    if (checkTimer.current) clearTimeout(checkTimer.current);
    checkTimer.current = setTimeout(async () => {
      const res = await checkUsername(username);
      setUsernameStatus(res.available ? "ok" : "taken");
    }, 500);
  }, [username]);

  const handlePhoneSubmit = async () => {
    if (!phone.trim()) return;
    setLoading(true); setError("");
    const res = await sendCode(phone);
    setLoading(false);
    if (res.error) setError(res.error);
    else {
      setDemoCode(res.demo_code || "");
      setStep("code");
    }
  };

  const handleCodeSubmit = async () => {
    if (code.length < 4) return;
    setLoading(true); setError("");
    const res = await verifyCode(phone, code);
    setLoading(false);
    if (res.error) { setError(res.error); return; }
    if (res.is_new) {
      setStep("name");
    } else if (res.token && res.user) {
      saveToken(res.token);
      onAuth(res.user);
    }
  };

  const handleNameSubmit = () => {
    if (!name.trim()) return;
    setStep("username");
  };

  const handleUsernameSubmit = async () => {
    if (usernameStatus !== "ok") return;
    setLoading(true); setError("");
    const res = await verifyCode(phone, code, name, username);
    setLoading(false);
    if (res.error) { setError(res.error); return; }
    if (res.token && res.user) {
      saveToken(res.token);
      onAuth(res.user);
    }
  };

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (!digits) return "";
    if (digits.startsWith("7") || digits.startsWith("8")) {
      const d = digits.startsWith("8") ? "7" + digits.slice(1) : digits;
      let f = "+" + d.slice(0, 1);
      if (d.length > 1) f += " (" + d.slice(1, 4);
      if (d.length > 4) f += ") " + d.slice(4, 7);
      if (d.length > 7) f += "-" + d.slice(7, 9);
      if (d.length > 9) f += "-" + d.slice(9, 11);
      return f;
    }
    return "+" + digits.slice(0, 14);
  };

  const usernameHint = () => {
    if (!username) return null;
    if (usernameStatus === "invalid") return { color: "text-red-400", text: "3–32 символа, только a-z, 0-9, _" };
    if (usernameStatus === "checking") return { color: "text-[hsl(var(--muted-foreground))]", text: "Проверяем..." };
    if (usernameStatus === "taken") return { color: "text-red-400", text: "Уже занят, попробуйте другой" };
    if (usernameStatus === "ok") return { color: "text-green-400", text: "Свободен!" };
    return null;
  };

  const hint = usernameHint();

  return (
    <div className="flex h-screen w-screen items-center justify-center p-4"
      style={{ background: "hsl(var(--chat-bg))" }}>
      <div className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center gap-6 animate-scale-in"
        style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 flex items-center justify-center">
            <svg viewBox="0 0 100 100" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logo-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2AABEE"/>
                  <stop offset="100%" stopColor="#1A6FA8"/>
                </linearGradient>
              </defs>
              <rect width="100" height="100" rx="22" fill="url(#logo-bg)"/>
              <path d="M18 50 L82 22 L58 78 L48 58 Z" fill="white" opacity="0.95"/>
              <path d="M48 58 L82 22 L55 65 Z" fill="white" opacity="0.6"/>
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Мини</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              {step === "phone" && "Введите номер телефона"}
              {step === "code" && "Введите код подтверждения"}
              {step === "name" && "Как вас зовут?"}
              {step === "username" && "Придумайте имя пользователя"}
            </p>
          </div>
        </div>

        {/* Phone */}
        {step === "phone" && (
          <div className="w-full flex flex-col gap-4 animate-fade-in">
            <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">Мы отправим вам код для входа</p>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
              <Icon name="Phone" size={18} className="text-[hsl(var(--muted-foreground))]" />
              <input type="tel" placeholder="+7 (999) 000-00-00" value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && handlePhoneSubmit()}
                className="flex-1 bg-transparent text-white placeholder:text-[hsl(var(--muted-foreground))] outline-none text-[15px]"
                autoFocus />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button onClick={handlePhoneSubmit} disabled={loading || !phone.trim()}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ background: "var(--tg-blue)" }}>
              {loading ? "Отправка..." : "Продолжить"}
            </button>
          </div>
        )}

        {/* Code */}
        {step === "code" && (
          <div className="w-full flex flex-col gap-4 animate-fade-in">
            <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
              Код отправлен на <span className="text-white font-medium">{phone}</span>
            </p>
            {demoCode ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
                style={{ background: "hsl(var(--primary) / 0.12)", border: "1px solid hsl(var(--primary) / 0.3)" }}>
                <Icon name="Info" size={16} style={{ color: "var(--tg-blue)" }} />
                <span className="text-[hsl(var(--foreground))]">
                  Демо-код: <strong className="text-white tracking-widest">{demoCode}</strong>
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
                style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
                <Icon name="MessageSquare" size={16} className="text-[hsl(var(--muted-foreground))]" />
                <span className="text-[hsl(var(--muted-foreground))]">SMS придёт в течение 1 минуты</span>
              </div>
            )}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
              <Icon name="KeyRound" size={18} className="text-[hsl(var(--muted-foreground))]" />
              <input type="text" inputMode="numeric" placeholder="12345" maxLength={6} value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && handleCodeSubmit()}
                className="flex-1 bg-transparent text-white placeholder:text-[hsl(var(--muted-foreground))] outline-none text-[15px] tracking-widest"
                autoFocus />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button onClick={handleCodeSubmit} disabled={loading || code.length < 4}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ background: "var(--tg-blue)" }}>
              {loading ? "Проверка..." : "Войти"}
            </button>
            <button onClick={() => { setStep("phone"); setCode(""); setError(""); }}
              className="text-sm text-[hsl(var(--muted-foreground))] hover:text-white transition-colors text-center">
              ← Изменить номер
            </button>
          </div>
        )}

        {/* Name */}
        {step === "name" && (
          <div className="w-full flex flex-col gap-4 animate-fade-in">
            <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">Первый вход! Как вас зовут?</p>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
              <Icon name="User" size={18} className="text-[hsl(var(--muted-foreground))]" />
              <input type="text" placeholder="Имя Фамилия" value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                className="flex-1 bg-transparent text-white placeholder:text-[hsl(var(--muted-foreground))] outline-none text-[15px]"
                autoFocus />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button onClick={handleNameSubmit} disabled={!name.trim()}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ background: "var(--tg-blue)" }}>
              Далее
            </button>
          </div>
        )}

        {/* Username */}
        {step === "username" && (
          <div className="w-full flex flex-col gap-4 animate-fade-in">
            <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
              По нему вас смогут найти другие пользователи
            </p>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
              <span className="text-[hsl(var(--muted-foreground))] font-medium text-base select-none">@</span>
              <input type="text" placeholder="username" value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && handleUsernameSubmit()}
                className="flex-1 bg-transparent text-white placeholder:text-[hsl(var(--muted-foreground))] outline-none text-[15px]"
                maxLength={32} autoFocus />
              {usernameStatus === "ok" && <Icon name="CheckCircle2" size={18} className="text-green-400 flex-shrink-0" />}
              {usernameStatus === "taken" && <Icon name="XCircle" size={18} className="text-red-400 flex-shrink-0" />}
              {usernameStatus === "checking" && (
                <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
                  style={{ borderColor: "var(--tg-blue)", borderTopColor: "transparent" }} />
              )}
            </div>
            {hint && <p className={`text-xs ${hint.color}`}>{hint.text}</p>}
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button onClick={handleUsernameSubmit} disabled={loading || usernameStatus !== "ok"}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ background: "var(--tg-blue)" }}>
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