"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { PuzzleItem } from "@/data/puzzlesMock";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { GlowContainer } from "@/components/ui/GlowContainer";
import { Modal } from "@/components/ui/Modal";
import { Typewriter } from "@/components/ui/Typewriter";
import { cn } from "@/lib/cn";
import { markPuzzleSolved } from "@/lib/solvedPuzzles";

function normalize(s: string) {
  return (s ?? "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[。，、,.;:!?！？"“”'‘’（）()【】\[\]{}<>]/g, "");
}

function fuzzyMatch(answer: string, keywords: string[]) {
  const a = normalize(answer);
  if (!a) return false;
  return keywords.some((k) => a.includes(normalize(k)));
}

export function PuzzleDetailClient({ puzzle }: { puzzle: PuzzleItem }) {
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const [showRoast, setShowRoast] = useState(false);
  const [solved, setSolved] = useState(false);

  const keywords = useMemo(() => puzzle.correctAnswer ?? [], [puzzle.correctAnswer]);

  const submit = () => {
    const ok = fuzzyMatch(input, keywords);
    if (!ok) {
      setShake(true);
      window.setTimeout(() => setShake(false), 340);
      setShowRoast(true);
      return;
    }

    markPuzzleSolved(puzzle.id);
    setSolved(true);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="text-xs font-black tracking-[0.28em] text-text-muted">
          CASE/{puzzle.id.toUpperCase()}
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl font-black tracking-tight text-text-primary">
            {puzzle.title}
          </h1>
          <div className="text-xs font-mono text-text-muted">
            TYPE/{puzzle.type} · DIFF/{puzzle.difficulty}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <GlowContainer variant="green" className="p-5">
          <div className="text-xs font-black tracking-[0.28em] text-text-muted">
            ARCHIVE_CONTENT
          </div>
          <div className="mt-3 rounded-xl border border-white/5 bg-bg-app/40 p-4 font-mono text-sm leading-6 text-text-primary">
            <Typewriter text={puzzle.content} speedMs={10} />
          </div>
        </GlowContainer>

        <GlowContainer
          variant="pink"
          className={cn("p-5", shake ? "mayi-shake" : "")}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-black tracking-[0.28em] text-text-muted">
              破解区
            </div>
            <div className="text-xs text-text-muted">
              写下你的推理关键字（支持模糊匹配）
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
              placeholder="比如：倒着走 / 伪造脚印 / 自指悖论..."
              className={cn(
                "w-full resize-none rounded-xl border border-border-pink/40 bg-bg-app/60 p-3 text-sm text-text-primary outline-none",
                "placeholder:text-text-muted/70 focus:border-accent-pink focus:shadow-glow-pink",
              )}
            />

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="green" onClick={submit}>
                提交推理
              </Button>
              <Link href="/puzzles" className="text-sm text-text-muted hover:text-text-primary">
                返回档案室
              </Link>
            </div>
          </div>
        </GlowContainer>
      </div>

      <Modal open={showRoast} title="MEIZI_ROAST" onClose={() => setShowRoast(false)}>
        <div className="flex items-start gap-3">
          <Avatar variant="pink" />
          <div className="space-y-2">
            <div className="text-sm font-black tracking-tight text-text-primary">
              梅子
            </div>
            <div className="text-sm leading-6 text-text-muted">{puzzle.meiziRoast}</div>
            <div className="pt-1">
              <Button variant="pink" onClick={() => setShowRoast(false)}>
                呜呜呜我重来捏
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {solved ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-bg-app/70 backdrop-blur-sm" />
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-green/20 blur-3xl" />
            <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(34,197,94,0.35)]" />
          </div>
          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-2xl border border-border-green bg-bg-surface/90 p-6 shadow-glow-green">
              <div className="text-xs font-black tracking-[0.28em] text-accent-green text-glow-green">
                CASE_SOLVED
              </div>
              <div className="mt-3 text-2xl font-black tracking-tight text-text-primary">
                破解成功!!
              </div>
              <div className="mt-2 text-sm text-text-muted">
                探员大人太强了捏...我宣布你今天的脑电波是绿的!!
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/puzzles">
                  <Button variant="green">返回档案室</Button>
                </Link>
                <Button variant="ghost" onClick={() => setSolved(false)}>
                  留在现场再看看
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

