import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { GlowContainer } from "@/components/ui/GlowContainer";

export function ChatHeader() {
  return (
    <GlowContainer variant="pink" className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar variant="pink" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="truncate text-sm font-black tracking-wider text-text-primary">
                梅子通讯频道
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-green">
                <span className="h-2 w-2 rounded-full bg-accent-green shadow-glow-green" />
                ONLINE
              </span>
            </div>
            <div className="mt-0.5 truncate text-xs text-text-muted">
              GUET · 推理研协 · 学习委员（自称）
            </div>
          </div>
        </div>

        <Badge variant="pink">MEIZI</Badge>
      </div>
    </GlowContainer>
  );
}

