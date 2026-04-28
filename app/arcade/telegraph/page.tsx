import { AppShell } from "@/components/layout/AppShell";
import { TelegraphClient } from "@/components/telegraph/TelegraphClient";

export default function TelegraphPage() {
  return (
    <AppShell>
      <TelegraphClient />
    </AppShell>
  );
}

