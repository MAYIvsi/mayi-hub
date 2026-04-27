import { cn } from "@/lib/cn";

export function TagPills({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <span
          key={t}
          className={cn(
            "rounded-full border border-white/10 bg-bg-app/40 px-2 py-0.5 text-[11px] font-semibold text-text-muted",
          )}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

