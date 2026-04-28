import * as React from "react";

export function GlassPanel({
  title,
  children,
  className,
  titleRight,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleRight?: React.ReactNode;
}) {
  return (
    <section
      className={[
        "rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl",
        className ?? "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="text-sm font-black tracking-[0.22em] text-white/80">
          {title}
        </div>
        {titleRight ? <div className="shrink-0">{titleRight}</div> : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

