"use client";

import { cn } from "@/lib/cn";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

export function Modal({
  open,
  title,
  children,
  onClose,
  panelClassName,
}: {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  panelClassName?: string;
}) {
  if (!open) return null;

  return createPortal(
    <div className="fixed top-0 left-0 z-[99999] h-screen w-screen bg-black/80 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label="close modal"
      />
      <div
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[92vw] max-w-lg",
          "rounded-2xl border border-border-pink bg-bg-surface/90 p-5 shadow-glow-pink",
          "animate-[mayi_modalIn_180ms_ease-out]",
          panelClassName,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="close"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-bg-app/40 text-text-muted transition-colors hover:text-text-primary hover:border-border-pink hover:shadow-glow-pink"
        >
          <X className="h-4 w-4" />
        </button>

        {title ? (
          <div className="text-xs font-black tracking-[0.28em] text-text-muted">
            {title}
          </div>
        ) : null}
        <div className={cn(title ? "mt-3" : "")}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}

