import { StatCard } from "@/components/dashboard/StatCard";

export type DashboardStat = {
  key: string;
  label: string;
  value: number | string;
  unit?: string;
  progress: number;
  accent?: "green" | "pink";
  hint?: { label: string; href: string; accent?: "pink" | "green" };
};

export function StatsGrid({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => (
        <StatCard
          key={s.key}
          label={s.label}
          value={s.value}
          unit={s.unit}
          progress={s.progress}
          accent={s.accent}
          hint={s.hint}
        />
      ))}
    </div>
  );
}

