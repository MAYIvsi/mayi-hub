import { cn } from "@/lib/cn";

export function Badge({
  className,
  variant = "green",
  children,
}: {
  className?: string;
  variant?: "green" | "pink" | "red";
  children: React.ReactNode;
}) {
  const variants = {
    green:
      "border-border-green text-accent-green bg-bg-app/40 shadow-[0_0_0_1px_rgba(34,197,94,0.2)]",
    pink:
      "border-border-pink text-accent-pink bg-bg-app/40 shadow-[0_0_0_1px_rgba(236,72,153,0.2)]",
    red: "border-red-500/40 text-red-400 bg-bg-app/40 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

