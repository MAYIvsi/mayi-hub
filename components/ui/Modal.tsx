"use client";

import { cn } from "@/lib/cn";

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="close modal"
      />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-2xl border border-border-pink bg-bg-surface/90 p-5 shadow-glow-pink">
          {title ? (
            <div className="text-xs font-black tracking-[0.28em] text-text-muted">
              {title}
            </div>
          ) : null}
          <div className={cn(title ? "mt-3" : "")}>{children}</div>
        </div>
      </div>
    </div>
  );
}

