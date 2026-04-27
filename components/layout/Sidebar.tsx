import {
  LayoutDashboard,
  MessageSquareText,
  FolderSearch,
} from "lucide-react";

import { MayiHubLogo } from "@/components/branding/MayiHubLogo";
import { AgentIdentityCard } from "@/components/layout/AgentIdentityCard";
import { ProfileDialog } from "@/components/layout/ProfileDialog";
import { NavItem } from "@/components/layout/NavItem";
import { cn } from "@/lib/cn";

export function Sidebar({
  className,
  emailPrefix,
  profile,
}: {
  className?: string;
  emailPrefix?: string | null;
  profile?: {
    role: "admin" | "agent";
    solved_cases: number;
    total_attempts: number;
    display_name?: string | null;
    avatar_url?: string | null;
    steam_id?: string | null;
  } | null;
}) {
  return (
    <aside
      className={cn(
        "hidden md:flex md:w-80 md:flex-col md:gap-6 md:border-r md:border-white/5 md:bg-bg-app/60 md:backdrop-blur",
        className,
      )}
    >
      <div className="px-5 pt-6">
        <MayiHubLogo />
      </div>

      <nav className="px-4">
        <div className="mb-3 px-3 text-xs font-black tracking-[0.28em] text-text-muted/80">
          MODULES
        </div>
        <div className="flex flex-col gap-1">
          <NavItem
            href="/"
            label="控制台"
            icon={<LayoutDashboard className="h-4 w-4 text-text-primary" />}
            glow="pink"
          />
          <NavItem
            href="/chat"
            label="梅子通讯频道"
            icon={<MessageSquareText className="h-4 w-4 text-text-primary" />}
            glow="pink"
          />
          <NavItem
            href="/puzzles"
            label="机密档案"
            icon={<FolderSearch className="h-4 w-4 text-text-primary" />}
            glow="pink"
          />
        </div>
      </nav>

      <div className="mt-auto px-4 pb-5">
        <ProfileDialog
          initialDisplayName={profile?.display_name ?? null}
          initialAvatarUrl={profile?.avatar_url ?? null}
          initialSteamId={profile?.steam_id ?? null}
          trigger={
            <AgentIdentityCard
              emailPrefix={emailPrefix}
              agentName={profile?.display_name ?? undefined}
              role={profile?.role ?? null}
              solvedCases={profile?.solved_cases ?? null}
              totalAttempts={profile?.total_attempts ?? null}
              avatarUrl={profile?.avatar_url ?? null}
            />
          }
        />
      </div>
    </aside>
  );
}

