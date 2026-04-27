import { cn } from "@/lib/cn";

export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-xs text-text-muted", className)}>
      <span className="h-2 w-2 rounded-full bg-accent-green/70 shadow-glow-green" />
      <span className="h-2 w-2 rounded-full bg-accent-green/45" />
      <span className="h-2 w-2 rounded-full bg-accent-green/25" />
      <span className="ml-2 font-mono">typing...</span>
    </div>
  );
}

