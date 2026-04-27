import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { useEffect, useRef } from "react";

export function ChatThread({
  messages,
  showTyping = true,
}: {
  messages: {
    id: string;
    role: "user" | "meizi";
    content: string;
    timestamp?: string;
    images?: { url: string; filename?: string; mediaType?: string }[];
  }[];
  showTyping?: boolean;
}) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, showTyping]);

  return (
    <div className="space-y-4">
      {messages.map((m) => (
        <MessageBubble
          key={m.id}
          role={m.role}
          content={m.content}
          images={m.images}
          timestamp={m.timestamp}
        />
      ))}
      {showTyping ? <TypingIndicator /> : null}
      <div ref={endRef} />
    </div>
  );
}

