import { cn } from "@/lib/cn";
import { Sparkles } from "lucide-react";

export function Avatar({
  className,
  variant = "pink",
}: {
  className?: string;
  variant?: "pink" | "green";
}) {
  const ring = variant === "green" ? "ring-border-green" : "ring-border-pink";
  const glow =
    variant === "green" ? "shadow-glow-green" : "shadow-glow-pink";
  const icon = variant === "green" ? "text-accent-green" : "text-accent-pink";

  return (
    <div
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full bg-bg-surface ring-1",
        ring,
        glow,
        className,
      )}
      aria-label="avatar"
    >
      <Sparkles className={cn("h-5 w-5", icon)} />
    </div>
  );
}

