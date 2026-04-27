import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import Link from "next/link";

export function AgentIdentityCard({
  className,
  agentName,
  emailPrefix,
  title,
  role,
  solvedCases,
  totalAttempts,
  avatarUrl,
}: {
  className?: string;
  agentName?: string;
  emailPrefix?: string | null;
  title?: string | null;
  role?: "admin" | "agent" | null;
  solvedCases?: number | null;
  totalAttempts?: number | null;
  avatarUrl?: string | null;
}) {
  const authed = Boolean(emailPrefix);
  const solved = typeof solvedCases === "number" ? solvedCases : null;
  const attempts = typeof totalAttempts === "number" ? totalAttempts : null;
  return (
    <div
      className={cn(
        authed
          ? "rounded-xl border border-border-green bg-bg-app/50 p-3 shadow-[0_0_0_1px_rgba(34,197,94,0.18)] backdrop-blur-sm"
          : "rounded-xl border border-border-pink bg-bg-app/50 p-3 shadow-[0_0_0_1px_rgba(236,72,153,0.18)] backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar variant={authed ? "green" : "pink"} avatarUrl={avatarUrl} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-black tracking-wider text-text-primary">
              {authed ? agentName ?? emailPrefix ?? "AGENT" : "未授权访客"}
            </div>
            {authed ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-green">
                <span className="h-2 w-2 rounded-full bg-accent-green shadow-glow-green" />
                ONLINE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-pink">
                <span className="h-2 w-2 rounded-full bg-accent-pink shadow-glow-pink" />
                UNAUTHORIZED
              </span>
            )}
          </div>
          {authed ? (
            <div className="mt-1 space-y-1">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span className="truncate">探员头衔</span>
                <span
                  className={cn(
                    "truncate font-semibold",
                    role === "admin"
                      ? "text-accent-pink mayi-pink-pulse"
                      : "text-accent-green",
                  )}
                >
                  {title ?? (role === "admin" ? "👑 无上站长" : "初级调查员")}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-text-muted">
                <span className="truncate">探员编号</span>
                <span className="font-mono text-accent-green">{emailPrefix}</span>
              </div>

              {solved != null || attempts != null ? (
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span className="truncate">档案战绩</span>
                  <span className="font-mono text-text-primary">
                    <span className="text-accent-green">{solved ?? 0}</span>
                    <span className="opacity-60"> / </span>
                    <span className="text-text-muted">{attempts ?? 0}</span>
                  </span>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-2">
              <Link href="/login">
                <Button variant="pink" size="sm" className="w-full">
                  前往登录
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

