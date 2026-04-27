"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

export function NavItem({
  href,
  label,
  icon,
  glow = "pink",
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  glow?: "pink" | "green";
}) {
  const pathname = usePathname();
  const active = pathname === href;

  const activeClasses =
    glow === "green"
      ? "border-border-green shadow-glow-green text-accent-green"
      : "border-border-pink shadow-glow-pink text-accent-pink";

  const hoverClasses =
    glow === "green"
      ? "hover:border-border-green/80 hover:text-accent-green hover:shadow-glow-green"
      : "hover:border-border-pink/80 hover:text-accent-pink hover:shadow-glow-pink";

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm font-semibold text-text-muted transition-all duration-200",
        "bg-transparent",
        hoverClasses,
        active && cn("bg-bg-surface/60", activeClasses),
      )}
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-bg-surface/60 ring-1 ring-white/5 transition-colors group-hover:bg-bg-surface/80">
        {icon}
      </span>
      <span className="tracking-wide">{label}</span>
      <span className="ml-auto h-2 w-2 rounded-full bg-accent-green/0 transition-colors group-hover:bg-accent-green/60" />
    </Link>
  );
}

