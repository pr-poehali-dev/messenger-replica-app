import { useState } from "react";
import { chats as initialChats, Chat } from "@/data/mockData";
import ChatList from "@/components/messenger/ChatList";
import ChatWindow from "@/components/messenger/ChatWindow";
import Sidebar from "@/components/messenger/Sidebar";

export default function Index() {
  const [chatList, setChatList] = useState<Chat[]>(initialChats);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const selectedChat = chatList.find((c) => c.id === selectedId) || null;

  const handleSelect = (id: number) => {
    setSelectedId(id);
    setMobileView("chat");
    setChatList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const handleSendMessage = (chatId: number, text: string) => {
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
                {
                  id: c.messages.length + 1,
                  text,
                  time,
                  isOut: true,
                  status: "sent" as const,
                },
              ],
            }
          : c
      )
    );
  };

  const handleBack = () => {
    setMobileView("list");
    setSelectedId(null);
  };

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
