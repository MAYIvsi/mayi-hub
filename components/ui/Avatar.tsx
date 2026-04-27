import { cn } from "@/lib/cn";
import { Sparkles } from "lucide-react";

const PRESET_AVATARS = [
  "neo-pink",
  "acid-green",
  "purple-haze",
  "cyan-noise",
  "sunset-glitch",
  "mono-signal",
] as const;

export type PresetAvatar = (typeof PRESET_AVATARS)[number];

function avatarGradient(key: string | null | undefined) {
  switch (key) {
    case "neo-pink":
      return "bg-gradient-to-br from-accent-pink/40 via-bg-surface to-bg-app";
    case "acid-green":
      return "bg-gradient-to-br from-accent-green/35 via-bg-surface to-bg-app";
    case "purple-haze":
      return "bg-gradient-to-br from-fuchsia-500/30 via-bg-surface to-bg-app";
    case "cyan-noise":
      return "bg-gradient-to-br from-cyan-400/25 via-bg-surface to-bg-app";
    case "sunset-glitch":
      return "bg-gradient-to-br from-orange-400/20 via-accent-pink/20 to-bg-app";
    case "mono-signal":
      return "bg-gradient-to-br from-zinc-200/10 via-bg-surface to-bg-app";
    default:
      return "bg-bg-surface";
  }
}

function isHttpUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export function Avatar({
  className,
  variant = "pink",
  avatarUrl,
}: {
  className?: string;
  variant?: "pink" | "green";
  avatarUrl?: string | null;
}) {
  const ring = variant === "green" ? "ring-border-green" : "ring-border-pink";
  const glow =
    variant === "green" ? "shadow-glow-green" : "shadow-glow-pink";
  const icon = variant === "green" ? "text-accent-green" : "text-accent-pink";

  const showImage = Boolean(avatarUrl && isHttpUrl(avatarUrl));

  return (
    <div
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full ring-1 overflow-hidden",
        showImage ? "bg-bg-surface" : avatarGradient(avatarUrl),
        ring,
        glow,
        className,
      )}
      aria-label="avatar"
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl!}
          alt="avatar"
          className="h-full w-full object-cover"
        />
      ) : (
        <Sparkles className={cn("h-5 w-5", icon)} />
      )}
    </div>
  );
}

export function getPresetAvatars(): readonly PresetAvatar[] {
  return PRESET_AVATARS;
}

