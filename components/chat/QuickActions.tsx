import { Button } from "@/components/ui/Button";

export function QuickActions({
  actions,
  onAction,
}: {
  actions: { id: string; label: string }[];
  onAction?: (action: { id: string; label: string }) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((a) => (
        <Button
          key={a.id}
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => onAction?.(a)}
        >
          {a.label}
        </Button>
      ))}
    </div>
  );
}

