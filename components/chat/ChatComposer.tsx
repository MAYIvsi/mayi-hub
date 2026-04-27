"use client";

import { CornerDownLeft, ImagePlus, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function ChatComposer({
  input,
  onInputChange,
  onSubmit,
  disabled,
}: {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (payload: {
    text: string;
    files?: Array<{
      type: "file";
      mediaType: string;
      filename?: string;
      url: string; // Data URL (base64)
    }>;
  }) => void | Promise<void>;
  disabled?: boolean;
}) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePart, setImagePart] = useState<{
    type: "file";
    mediaType: string;
    filename?: string;
    url: string;
  } | null>(null);

  const hasImage = Boolean(imagePart?.url);

  const imageLabel = useMemo(() => {
    if (!imagePart) return null;
    return imagePart.filename || imagePart.mediaType || "image";
  }, [imagePart]);

  const readFileAsDataUrl = async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("failed to read file"));
      reader.readAsDataURL(file);
    });
    return dataUrl;
  };

  const setFromFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = await readFileAsDataUrl(file);
    setImagePart({
      type: "file",
      mediaType: file.type || "image/*",
      filename: file.name,
      url,
    });
  };

  return (
    <div className="rounded-xl border border-border-pink bg-bg-app/60 p-3 backdrop-blur-sm">
      <form
        ref={formRef}
        className="flex items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          const text = input.trim();
          const files = imagePart ? [imagePart] : undefined;
          if (!text && !files?.length) return;
          onSubmit({ text, files });
          setImagePart(null);
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            await setFromFile(file);
            // allow selecting the same file again
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "h-10 w-10 px-0",
            "border border-white/10 bg-bg-surface/40 text-text-muted",
            "hover:border-border-pink hover:text-text-primary hover:shadow-glow-pink",
          )}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          aria-label="上传图片"
          title="上传图片"
        >
          <ImagePlus className="h-4 w-4" />
        </Button>
        <label className="flex-1">
          <div className="sr-only">输入消息</div>
          {hasImage ? (
            <div className="mb-2 flex items-center justify-between gap-3 rounded-xl border border-border-green/40 bg-bg-surface/40 px-2 py-2 shadow-glow-green">
              <div className="flex items-center gap-3">
                <img
                  src={imagePart?.url}
                  alt={imageLabel ?? "image preview"}
                  className="h-12 w-12 rounded-lg border border-white/10 object-cover"
                />
                <div className="min-w-0">
                  <div className="truncate text-xs text-text-muted">已选图片</div>
                  <div className="truncate text-xs text-text-primary">{imageLabel}</div>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                className={cn(
                  "h-8 w-8 px-0",
                  "border border-white/10 bg-bg-app/40 text-text-muted",
                  "hover:border-border-pink hover:text-text-primary hover:shadow-glow-pink",
                )}
                onClick={() => setImagePart(null)}
                aria-label="移除图片"
                title="移除图片"
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : null}
          <textarea
            rows={1}
            placeholder="给梅子发条讯息...（别写八股哦）"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              // While using IME (Chinese/Japanese), Enter might be used to confirm composition.
              // Don't hijack that.
              if ((e as unknown as { isComposing?: boolean }).isComposing) return;

              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (disabled) return;
                formRef.current?.requestSubmit();
              }
            }}
            onPaste={async (e) => {
              const files = Array.from(e.clipboardData?.files ?? []);
              const image = files.find((f) => f.type.startsWith("image/"));
              if (!image) return;
              e.preventDefault();
              await setFromFile(image);
            }}
            disabled={disabled}
            className={cn(
              "w-full resize-none bg-transparent px-2 py-2 text-sm text-text-primary outline-none",
              "placeholder:text-text-muted/70",
              "border-b border-text-muted/30 focus:border-accent-pink",
              "disabled:opacity-60",
            )}
          />
        </label>
        <Button variant="green" className="h-10 px-3" type="submit" disabled={disabled}>
          <CornerDownLeft className="h-4 w-4" />
          发送
        </Button>
      </form>
    </div>
  );
}

