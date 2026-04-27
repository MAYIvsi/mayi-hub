import { GlowContainer } from "@/components/ui/GlowContainer";

export function WelcomeBanner({
  headline,
  subline,
}: {
  headline: string;
  subline: string;
}) {
  return (
    <GlowContainer variant="pink" className="relative overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-accent-pink/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-accent-green/15 blur-3xl" />
      </div>

      <div className="relative">
        <div className="text-xs font-black tracking-[0.28em] text-text-muted">
          WELCOME_PANEL
        </div>
        <div className="mt-2 text-3xl font-black tracking-tight text-text-primary md:text-5xl">
          <span className="text-glow-pink">{headline}</span>
          <span className="mx-2 text-accent-green text-glow-green">/</span>
          <span className="text-accent-green text-glow-green">CASE FILES</span>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-text-muted md:text-base">
          {subline}
        </p>
      </div>
    </GlowContainer>
  );
}

