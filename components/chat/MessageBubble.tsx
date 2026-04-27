"use client";

import { cn } from "@/lib/cn";
import type { ChatMessage } from "@/types/chat";
import { Modal } from "@/components/ui/Modal";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { useMemo, useState } from "react";

type BubbleRole = "user" | "meizi";

export function MessageBubble({
  role,
  content,
  images,
  timestamp,
}: {
  role: BubbleRole;
  content: string;
  images?: { url: string; filename?: string; mediaType?: string }[];
  timestamp?: string;
}) {
  const isUser = role === "user";
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const hasImages = Boolean(images && images.length > 0);
  const previewTitle = useMemo(() => {
    if (!previewUrl) return "图片预览";
    const match = (images ?? []).find((i) => i.url === previewUrl);
    return match?.filename ?? "图片预览";
  }, [images, previewUrl]);

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

          {hasImages ? (
            <div
              className={cn(
                "mt-3 grid gap-2",
                images!.length > 1 ? "grid-cols-2" : "grid-cols-1",
              )}
            >
              {images!.map((img) => (
                <button
                  key={img.url}
                  type="button"
                  className={cn(
                    "group relative overflow-hidden rounded-xl border border-white/10",
                    isUser ? "hover:border-border-green" : "hover:border-border-pink",
                  )}
                  onClick={() => setPreviewUrl(img.url)}
                  aria-label={img.filename ? `预览 ${img.filename}` : "预览图片"}
                >
                  <img
                    src={img.url}
                    alt={img.filename ?? "image"}
                    className="max-h-64 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        {timestamp ? (
          <div className="text-xs text-text-muted">{timestamp}</div>
        ) : null}
      </div>

      <Modal
        open={Boolean(previewUrl)}
        onClose={() => setPreviewUrl(null)}
        title={previewTitle}
        panelClassName="max-w-3xl"
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => setPreviewUrl(null)}
            aria-label="close"
            className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-bg-app/40 text-text-muted transition-colors hover:text-text-primary hover:border-border-pink hover:shadow-glow-pink"
          >
            <X className="h-4 w-4" />
          </button>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={previewTitle}
              className="max-h-[70vh] w-full rounded-xl border border-white/10 object-contain"
            />
          ) : null}
        </div>
      </Modal>
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

