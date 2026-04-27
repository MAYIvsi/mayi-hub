import { AppShell } from "@/components/layout/AppShell";
import { MeiziTerminalFeed } from "@/components/dashboard/MeiziTerminalFeed";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { SystemNotice } from "@/components/dashboard/SystemNotice";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { meiziTerminalFeed } from "@/data/meiziFeed";
import { createClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/supabase/profile";
import { headers } from "next/headers";

function pct(n: number, d: number) {
  if (!Number.isFinite(n) || !Number.isFinite(d) || d <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((n / d) * 100)));
}

async function fetchSteamTotalHours(steamId: string) {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (!host) throw new Error("missing host header");

  const url = `${proto}://${host}/api/steam?steam_id=${encodeURIComponent(steamId)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`steam api ${res.status}`);
  const json = (await res.json()) as { total_hours?: number };
  if (typeof json.total_hours !== "number") throw new Error("bad steam payload");
  return json.total_hours;
}

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const profile = data.user ? await getMyProfile(supabase, data.user.id) : null;

  const solved = profile?.solved_cases ?? 0;
  const attempts = profile?.total_attempts ?? 0;
  const accuracy = attempts > 0 ? Math.round((solved / attempts) * 100) : 0;

  const steamId = profile?.steam_id?.trim() || null;
  let steamHours: number | null = null;
  let steamError = false;
  if (steamId) {
    try {
      steamHours = await fetchSteamTotalHours(steamId);
    } catch {
      steamError = true;
    }
  }

  const stats = [
    {
      key: "casesSolved",
      label: "已破解案件",
      value: solved,
      unit: "件",
      progress: pct(solved, Math.max(1, attempts)),
      accent: "green" as const,
    },
    {
      key: "steamHours",
      label: "Steam 摸鱼时长",
      value:
        steamHours != null
          ? steamHours
          : "未绑定或隐私受限",
      unit: steamHours != null ? "h" : "",
      progress: steamHours != null ? Math.max(1, Math.min(100, Math.round((steamHours / 3000) * 100))) : 0,
      accent: steamHours != null ? ("green" as const) : ("pink" as const),
      hint:
        steamHours == null
          ? { label: "去绑定 →", href: "/profile", accent: "pink" as const }
          : undefined,
    },
    {
      key: "accuracy",
      label: "命中率",
      value: `${accuracy}%`,
      unit: "",
      progress: accuracy,
      accent: "green" as const,
    },
    {
      key: "role",
      label: "权限等级",
      value: profile?.role === "admin" ? "ADMIN" : "AGENT",
      unit: "",
      progress: profile?.role === "admin" ? 100 : 40,
      accent: profile?.role === "admin" ? ("pink" as const) : ("green" as const),
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <WelcomeBanner
          headline={`WELCOME BACK, ${data.user?.email?.split("@")[0]?.toUpperCase() ?? "AGENT"}`}
          subline={
            profile?.role === "admin"
              ? "👑 最高权限探员归位!! 系统把粉色霓虹拉满了捏...（推眼镜）"
              : "探员大人快快快!! 我把卷宗都摆好了捏...（咬笔头）"
          }
        />

        <StatsGrid stats={stats} />

        <div className="grid gap-4 xl:grid-cols-2">
          <SystemNotice
            items={[
              {
                title: profile?.role === "admin" ? "权限验证：已授予最高权限" : "权限验证：标准探员",
                body:
                  profile?.role === "admin"
                    ? "欢迎回到控制台，站长级操作请轻拿轻放捏（"
                    : "机密档案室已上锁，未经授权勿闯入捏。",
                tag: profile?.role === "admin" ? "ADMIN" : "AGENT",
              },
              {
                title: "进度记录：已同步 profiles",
                body: `solved_cases=${solved} · total_attempts=${attempts}`,
                tag: "SYNC",
              },
              ...(steamId
                ? [
                    {
                      title: "Steam 连线",
                      body: steamError
                        ? "Steam API 暂时拉不下来数据（可能网络/隐私/ID 错误）"
                        : `steam_id=${steamId} · total_hours=${steamHours ?? "?"}`,
                      tag: "STEAM",
                    },
                  ]
                : []),
            ]}
          />
          <MeiziTerminalFeed lines={meiziTerminalFeed} />
        </div>
      </div>
    </AppShell>
  );
}
