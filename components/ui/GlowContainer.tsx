import { cn } from "@/lib/cn";

type GlowVariant = "pink" | "green";

export function GlowContainer({
  className,
  variant = "pink",
  children,
}: {
  className?: string;
  variant?: GlowVariant;
  children: React.ReactNode;
}) {
  const borderClass =
    variant === "green" ? "border-border-green" : "border-border-pink";
  const hoverShadowClass =
    variant === "green" ? "hover:shadow-glow-green" : "hover:shadow-glow-pink";

  return (
    <div
      className={cn(
        "rounded-xl border bg-bg-surface/90 backdrop-blur-sm shadow-black/40",
        borderClass,
        "transition-shadow duration-200",
        hoverShadowClass,
        className,
      )}
    >
      {children}
    </div>
  );
}

