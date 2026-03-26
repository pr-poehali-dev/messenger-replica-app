import { useState, useEffect, useCallback } from "react";
import { fetchChats, fetchMessages, sendMessage, ApiChat, ApiMessage } from "@/api/chatApi";
import ChatList from "@/components/messenger/ChatList";
import ChatWindow from "@/components/messenger/ChatWindow";
import Sidebar from "@/components/messenger/Sidebar";
import { Chat, Message } from "@/data/mockData";

function apiChatToChat(c: ApiChat, messages: Message[] = []): Chat {
  return {
    id: c.id,
    name: c.name,
    type: c.type,
    avatar: c.avatar,
    verified: c.verified,
    muted: c.muted,
    lastMessage: c.last_message || '',
    time: c.last_time || '',
    unread: Number(c.unread_count) || 0,
    online: false,
    pinned: false,
    messages,
  };
}

function apiMsgToMsg(m: ApiMessage): Message {
  return {
    id: m.id,
    text: m.text,
    time: m.time,
    isOut: m.is_out,
    status: m.is_out ? 'read' : undefined,
    forwarded: m.forwarded,
  };
}

export default function Index() {
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [loading, setLoading] = useState(true);

  const selectedChat = chatList.find((c) => c.id === selectedId) || null;

  useEffect(() => {
    fetchChats()
      .then((apiChats) => {
        setChatList(apiChats.map((c) => apiChatToChat(c)));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = useCallback(async (id: number) => {
    setSelectedId(id);
    setMobileView("chat");
    setChatList((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));

    const apiMsgs = await fetchMessages(id);
    const messages = apiMsgs.map(apiMsgToMsg);
    setChatList((prev) => prev.map((c) => (c.id === id ? { ...c, messages } : c)));
  }, []);

  const handleSendMessage = useCallback(async (chatId: number, text: string) => {
    const optimisticId = Date.now();
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    setChatList((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              lastMessage: text,
              time,
              messages: [
                ...c.messages,
                { id: optimisticId, text, time, isOut: true, status: 'sent' as const },
              ],
            }
          : c
      )
    );

    const saved = await sendMessage(chatId, text);
    setChatList((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === optimisticId ? { ...m, id: saved.id, time: saved.time, status: 'delivered' as const } : m
              ),
            }
          : c
      )
    );
  }, []);

  const handleBack = () => {
    setMobileView("list");
    setSelectedId(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center" style={{ background: "hsl(var(--chat-bg))" }}>
        <div className="flex flex-col items-center gap-3 text-[hsl(var(--muted-foreground))]">
          <div
            className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--tg-blue)", borderTopColor: "transparent" }}
          />
          <p className="text-sm">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "hsl(var(--chat-bg))" }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Desktop layout */}
      <div className="hidden md:flex w-full h-full">
        <ChatList
          chats={chatList}
          selectedId={selectedId}
          onSelect={handleSelect}
          onMenuOpen={() => setSidebarOpen(true)}
        />
        <ChatWindow
          chat={selectedChat}
          onSendMessage={handleSendMessage}
        />
      </div>

      {/* Mobile layout */}
      <div className="flex md:hidden w-full h-full">
        {mobileView === "list" && (
          <div className="w-full animate-fade-in">
            <ChatList
              chats={chatList}
              selectedId={selectedId}
              onSelect={handleSelect}
              onMenuOpen={() => setSidebarOpen(true)}
            />
          </div>
        )}
        {mobileView === "chat" && (
          <div className="w-full animate-slide-in-right">
            <ChatWindow
              chat={selectedChat}
              onSendMessage={handleSendMessage}
              onBack={handleBack}
            />
          </div>
        )}
      </div>
    </div>
  );
}
