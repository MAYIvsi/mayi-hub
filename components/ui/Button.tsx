import { cn } from "@/lib/cn";

type Variant = "pink" | "green" | "ghost";

export function Button({
  className,
  variant = "pink",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "sm" | "md";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none";

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
  } as const;

  const variants = {
    pink: "bg-accent-pink text-bg-app hover:bg-accent-pink/90 shadow-glow-pink",
    green:
      "bg-accent-green text-bg-app hover:bg-accent-green/90 shadow-glow-green",
    ghost:
      "bg-transparent text-text-primary hover:bg-bg-surface/60 border border-border-pink/40",
  } as const;

  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}

