import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";

export function ChatThread({
  messages,
  showTyping = true,
}: {
  messages: { id: string; role: "user" | "meizi"; content: string; timestamp?: string }[];
  showTyping?: boolean;
}) {
  return (
    <div className="space-y-4">
      {messages.map((m) => (
        <MessageBubble
          key={m.id}
          role={m.role}
          content={m.content}
          timestamp={m.timestamp}
        />
      ))}
      {showTyping ? <TypingIndicator /> : null}
    </div>
  );
}

