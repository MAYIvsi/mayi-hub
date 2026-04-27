"use client";

import { useEffect, useMemo, useState } from "react";

export function Typewriter({
  text,
  speedMs = 14,
}: {
  text: string;
  speedMs?: number;
}) {
  const full = useMemo(() => text ?? "", [text]);
  const [len, setLen] = useState(0);

  useEffect(() => {
    setLen(0);
    if (!full) return;

    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      setLen((prev) => {
        if (prev >= full.length) return prev;
        return prev + 1;
      });
    };

    const id = window.setInterval(tick, speedMs);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [full, speedMs]);

  return <div className="whitespace-pre-wrap">{full.slice(0, len)}</div>;
}

