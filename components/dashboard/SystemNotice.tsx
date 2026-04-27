import { Badge } from "@/components/ui/Badge";
import { GlowContainer } from "@/components/ui/GlowContainer";

export type NoticeItem = {
  title: string;
  body: string;
  tag: string;
};

export function SystemNotice({ items }: { items: NoticeItem[] }) {
  return (
    <GlowContainer variant="green" className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-black tracking-[0.28em] text-text-muted">
          SYSTEM_NOTICES
        </div>
        <Badge variant="green">LIVE</Badge>
      </div>

      <div className="mt-4 space-y-4">
        {items.map((it, idx) => (
          <div key={idx} className="rounded-lg border border-white/5 bg-bg-app/40 p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm font-black tracking-tight text-text-primary">
                {it.title}
              </div>
              <Badge variant={it.tag === "MEIZI" ? "pink" : "green"}>
                {it.tag}
              </Badge>
            </div>
            <div className="mt-1 text-sm leading-6 text-text-muted">{it.body}</div>
          </div>
        ))}
      </div>
    </GlowContainer>
  );
}

