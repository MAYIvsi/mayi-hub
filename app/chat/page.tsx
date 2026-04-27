import { AppShell } from "@/components/layout/AppShell";
import { ChatClient } from "@/components/chat/ChatClient";

export default function ChatPage() {
  return (
    <AppShell>
      <ChatClient />
    </AppShell>
  );
}

