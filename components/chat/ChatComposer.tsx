"use client";

import { CornerDownLeft } from "lucide-react";

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
  onSubmit: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border-pink bg-bg-app/60 p-3 backdrop-blur-sm">
      <form
        className="flex items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <label className="flex-1">
          <div className="sr-only">输入消息</div>
          <textarea
            rows={1}
            placeholder="给梅子发条讯息...（别写八股哦）"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
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

