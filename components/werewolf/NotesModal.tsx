import * as React from "react";

export function NotesModal({
  open,
  title,
  value,
  onChange,
  onClose,
  onSave,
}: {
  open: boolean;
  title: string;
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  onSave?: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#09090b]/90 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_30px_120px_rgba(0,0,0,0.75)] backdrop-blur-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-black tracking-[0.28em] text-white/50">
              QUICK_NOTES
            </div>
            <div className="mt-2 text-lg font-black tracking-tight text-white">
              {title}
            </div>
          </div>
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="速记发言逻辑…"
          className="mt-4 h-72 w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/85 placeholder:text-white/25 outline-none backdrop-blur focus:border-fuchsia-400/60 focus:shadow-[0_0_0_4px_rgba(217,70,239,0.16)]"
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-white/40">
            提示：这里只存纯文本速记，后面阶段会接入结构化日志与 AI 复盘。
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => (onSave ? onSave() : onClose())}
              className="rounded-xl border border-border-pink/60 bg-fuchsia-500/15 px-4 py-2 text-sm font-black text-fuchsia-100 shadow-[0_0_0_1px_rgba(236,72,153,0.18),0_0_28px_rgba(236,72,153,0.18)] transition hover:border-border-pink/80 hover:bg-fuchsia-500/20"
            >
              保存笔记
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white/70 hover:border-white/20 hover:bg-white/7.5"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

