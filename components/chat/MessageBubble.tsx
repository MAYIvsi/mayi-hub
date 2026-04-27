import { cn } from "@/lib/cn";
import type { ChatMessage } from "@/types/chat";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

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
          {isUser ? (
            <div className="whitespace-pre-wrap">{content}</div>
          ) : (
            <div
              className={cn(
                "text-text-primary",
                "leading-relaxed",
                "[&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0",
                "[&>ul]:my-2 [&>ul]:list-disc [&>ul]:pl-5",
                "[&>ol]:my-2 [&>ol]:list-decimal [&>ol]:pl-5",
                "[&>blockquote]:my-2 [&>blockquote]:border-l-2 [&>blockquote]:border-border-green [&>blockquote]:pl-3 [&>blockquote]:text-text-muted",
                "[&>pre]:my-2 [&>pre]:overflow-auto [&>pre]:rounded-xl [&>pre]:border [&>pre]:border-border-green/40 [&>pre]:bg-bg-surface/60 [&>pre]:p-3",
                "[&>pre>code]:font-mono [&>code]:rounded [&>code]:bg-bg-surface/60 [&>code]:px-1 [&>code]:py-0.5 [&>code]:font-mono",
                "[&_strong]:text-text-primary [&_strong]:font-black",
                "[&_a]:text-accent-pink [&_a]:underline",
              )}
            >
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {content}
              </ReactMarkdown>
            </div>
          )}
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

