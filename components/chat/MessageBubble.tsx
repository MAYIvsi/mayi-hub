import { cn } from "@/lib/cn";
import type { ChatMessage } from "@/types/chat";

type BubbleRole = "user" | "meizi";

export function MessageBubble({
  role,
  content,
  timestamp,
}: {
  role: BubbleRole;
  content: string;
  timestamp?: string;
}) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div className={cn("max-w-[42rem] space-y-1", isUser ? "text-right" : "")}>
        <div
          className={cn(
            "inline-block rounded-2xl border px-4 py-3 text-sm leading-6 backdrop-blur-sm",
            isUser
              ? "bg-bg-surface/70 border-border-green text-text-primary shadow-glow-green"
              : "bg-bg-app/60 border-border-pink text-text-primary shadow-glow-pink",
          )}
        >
          <div className="whitespace-pre-wrap">{content}</div>
        </div>
        {timestamp ? (
          <div className="text-xs text-text-muted">{timestamp}</div>
        ) : null}
      </div>
    </div>
  );
}

export function MessageBubbleFromMock({ message }: { message: ChatMessage }) {
  return (
    <MessageBubble
      role={message.role}
      content={message.content}
      timestamp={message.timestamp}
    />
  );
}

