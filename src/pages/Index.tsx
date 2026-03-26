import { useState, useEffect, useCallback } from "react";
import { fetchChats, fetchMessages, sendMessage, ApiChat, ApiMessage } from "@/api/chatApi";
import { getMe, logout, getToken, AuthUser } from "@/api/authApi";
import ChatList from "@/components/messenger/ChatList";
import ChatWindow from "@/components/messenger/ChatWindow";
import Sidebar from "@/components/messenger/Sidebar";
import AuthScreen from "@/components/auth/AuthScreen";
import NewChatModal from "@/components/messenger/NewChatModal";
import SettingsScreen from "@/components/settings/SettingsScreen";
import { Chat, Message } from "@/data/mockData";

function apiChatToChat(c: ApiChat, messages: Message[] = []): Chat {
  return {
    id: c.id, name: c.name, type: c.type, avatar: c.avatar,
    verified: c.verified, muted: c.muted,
    lastMessage: c.last_message || '', time: c.last_time || '',
    unread: Number(c.unread_count) || 0, online: false, pinned: false, messages,
  };
}

function apiMsgToMsg(m: ApiMessage): Message {
  return {
    id: m.id, text: m.text, time: m.time, isOut: m.is_out,
    status: m.is_out ? 'read' : undefined, forwarded: m.forwarded,
  };
}

export default function Index() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [chatsLoading, setChatsLoading] = useState(false);

  const selectedChat = chatList.find((c) => c.id === selectedId) || null;

  useEffect(() => {
    if (!getToken()) { setAuthChecked(true); return; }
    getMe().then((u) => { setUser(u); setAuthChecked(true); });
  }, []);

  useEffect(() => {
    if (!user) return;
    setChatsLoading(true);
    fetchChats().then((apiChats) => setChatList(apiChats.map((c) => apiChatToChat(c)))).finally(() => setChatsLoading(false));
  }, [user]);

  const refreshChats = useCallback(async () => {
    const apiChats = await fetchChats();
    setChatList(apiChats.map((c) => apiChatToChat(c)));
  }, []);

  const handleAuth = (u: AuthUser) => setUser(u);

  const handleSelect = useCallback(async (id: number) => {
    setSelectedId(id); setMobileView("chat");
    setChatList((prev) => prev.map((c) => c.id === id ? { ...c, unread: 0 } : c));
    const msgs = await fetchMessages(id);
    setChatList((prev) => prev.map((c) => c.id === id ? { ...c, messages: msgs.map(apiMsgToMsg) } : c));
  }, []);

  const handleChatCreated = useCallback(async (chatId: number) => {
    await refreshChats(); handleSelect(chatId);
  }, [refreshChats, handleSelect]);

  const handleSendMessage = useCallback(async (chatId: number, text: string) => {
    const optimisticId = Date.now();
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setChatList((prev) => prev.map((c) =>
      c.id === chatId ? { ...c, lastMessage: text, time, messages: [...c.messages, { id: optimisticId, text, time, isOut: true, status: 'sent' as const }] } : c
    ));
    const saved = await sendMessage(chatId, text);
    setChatList((prev) => prev.map((c) =>
      c.id === chatId ? { ...c, messages: c.messages.map((m) => m.id === optimisticId ? { ...m, id: saved.id, time: saved.time, status: 'delivered' as const } : m) } : c
    ));
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null); setChatList([]); setSelectedId(null); setSidebarOpen(false); setSettingsOpen(false);
  };

  const handleBack = () => { setMobileView("list"); setSelectedId(null); };

  if (!authChecked) {
    return (
      <div className="flex h-screen w-screen items-center justify-center" style={{ background: "hsl(var(--chat-bg))" }}>
        <div className="w-12 h-12 rounded-full border-2 animate-spin" style={{ borderColor: "var(--tg-blue)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!user) return <AuthScreen onAuth={handleAuth} />;

  // Настройки — занимают всё окно поверх
  if (settingsOpen) {
    return (
      <div className="flex h-screen w-screen overflow-hidden" style={{ background: "hsl(var(--chat-bg))" }}>
        {/* На десктопе — в левой панели */}
        <div className="hidden md:flex w-full h-full">
          <div className="flex flex-col h-full border-r border-[hsl(var(--border))]" style={{ width: "340px", minWidth: "340px" }}>
            <SettingsScreen
              user={user}
              onClose={() => setSettingsOpen(false)}
              onUserUpdate={(u) => setUser(u)}
              onLogout={handleLogout}
            />
          </div>
          <ChatWindow chat={selectedChat} onSendMessage={handleSendMessage} />
        </div>
        {/* На мобайле — полный экран */}
        <div className="flex md:hidden w-full h-full animate-slide-in-right">
          <SettingsScreen
            user={user}
            onClose={() => setSettingsOpen(false)}
            onUserUpdate={(u) => setUser(u)}
            onLogout={handleLogout}
          />
        </div>
      </div>
    );
  }

  if (chatsLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center" style={{ background: "hsl(var(--chat-bg))" }}>
        <div className="flex flex-col items-center gap-3 text-[hsl(var(--muted-foreground))]">
          <div className="w-12 h-12 rounded-full border-2 animate-spin" style={{ borderColor: "var(--tg-blue)", borderTopColor: "transparent" }} />
          <p className="text-sm">Загрузка чатов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "hsl(var(--chat-bg))" }}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {newChatOpen && <NewChatModal onClose={() => setNewChatOpen(false)} onChatCreated={handleChatCreated} />}

      <div className="hidden md:flex w-full h-full">
        <ChatList chats={chatList} selectedId={selectedId} onSelect={handleSelect}
          onMenuOpen={() => setSidebarOpen(true)} onNewChat={() => setNewChatOpen(true)} />
        <ChatWindow chat={selectedChat} onSendMessage={handleSendMessage} />
      </div>

      <div className="flex md:hidden w-full h-full">
        {mobileView === "list" && (
          <div className="w-full animate-fade-in">
            <ChatList chats={chatList} selectedId={selectedId} onSelect={handleSelect}
              onMenuOpen={() => setSidebarOpen(true)} onNewChat={() => setNewChatOpen(true)} />
          </div>
        )}
        {mobileView === "chat" && (
          <div className="w-full animate-slide-in-right">
            <ChatWindow chat={selectedChat} onSendMessage={handleSendMessage} onBack={handleBack} />
          </div>
        )}
      </div>
    </div>
  );
}
