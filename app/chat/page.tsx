import { AppShell } from "@/components/layout/AppShell";
import { ChatClient } from "@/components/chat/ChatClient";

export default function ChatPage() {
  return (
    <AppShell>
      <div className="h-[calc(100vh-2rem)] overflow-hidden">
        <div className="flex h-full flex-col">
          <ChatClient />
        </div>
      </div>
    </AppShell>
  );
}

