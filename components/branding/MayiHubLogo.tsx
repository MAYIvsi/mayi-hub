import { cn } from "@/lib/cn";

export function MayiHubLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="grid h-9 w-9 place-items-center rounded-lg border border-border-pink bg-bg-app shadow-glow-pink">
        <span className="text-sm font-black tracking-widest text-accent-pink">
          梅
        </span>
      </div>
      <div className="leading-tight">
        <div className="text-sm font-black tracking-[0.22em] text-accent-pink text-glow-pink">
          梅子侦探事务所
        </div>
        <div className="text-xs text-text-muted">Meizi Detective Agency</div>
      </div>
    </div>
  );
}

