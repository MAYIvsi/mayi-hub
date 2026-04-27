import { Terminal } from "@/components/ui/Terminal";

export function MeiziTerminalFeed({ lines }: { lines: string[] }) {
  return <Terminal title="MEIZI_FEED" lines={lines} />;
}

