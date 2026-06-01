"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getAllLearnItems } from "@/data/learn";
import { type Grade, getDueIds, review } from "@/lib/srs";
import { playLine } from "@/lib/audio";
import type { Line } from "@/lib/types";

type Direction = "zh2en" | "en2zh";

export default function ReviewPage() {
  const items = useMemo(() => getAllLearnItems(), []);
  const itemMap = useMemo(
    () => Object.fromEntries(items.map((i) => [i.id, i])),
    [items]
  );

  const [queue, setQueue] = useState<string[] | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [direction, setDirection] = useState<Direction>("zh2en");
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);

  // 進入時抓一次到期清單（用 effect 避免 SSR/hydration 不一致）
  useEffect(() => {
    const due = getDueIds(items.map((i) => i.id));
    setQueue(due);
    setTotal(due.length);
  }, [items]);

  if (queue === null) {
    return <div className="px-4 pt-10 text-center text-[var(--text-muted)]">載入中…</div>;
  }

  const currentId = queue[0];
  const item = currentId ? itemMap[currentId] : undefined;

  // 取得發音用的 Line（單字用本體，句型用第一句例句）
  const audioLine = (): Line | undefined => {
    if (!item) return undefined;
    if (item.audio) return { en: item.en, zh: item.zh, audio: item.audio };
    return item.examples?.[0];
  };

  const handleReveal = () => {
    setRevealed(true);
    const line = audioLine();
    if (line) playLine(line, 1);
  };

  const handleGrade = (grade: Grade) => {
    if (!currentId) return;
    review(currentId, grade);
    setRevealed(false);
    setQueue((q) => {
      if (!q) return q;
      const [head, ...rest] = q;
      if (grade === "again") return [...rest, head]; // 答錯：排到本次最後再考
      return rest;
    });
    if (grade !== "again") setDone((d) => d + 1);
  };

  // 完成
  if (!item) {
    return (
      <div className="px-4 pt-4">
        <Header />
        <div className="mt-20 text-center">
          <p className="text-5xl">🎉</p>
          <p className="mt-4 text-lg font-bold">複習完成！</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {total > 0 ? `這次複習了 ${total} 張卡。` : "目前沒有到期的卡片。"}
          </p>
          <Link
            href="/learn"
            className="mt-6 inline-block rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white"
          >
            回學習庫
          </Link>
        </div>
      </div>
    );
  }

  const remaining = queue.length;
  const front = direction === "zh2en" ? item.zh : item.en;
  const back = direction === "zh2en" ? item.en : item.zh;

  return (
    <div className="flex min-h-[80vh] flex-col px-4 pt-4">
      <Header />

      {/* 進度 + 方向切換 */}
      <div className="mb-4 flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>
          剩 {remaining} 張・已複習 {done}/{total}
        </span>
        <button
          type="button"
          onClick={() => setDirection((d) => (d === "zh2en" ? "en2zh" : "zh2en"))}
          className="rounded-full border border-[var(--border)] px-3 py-1 font-medium"
        >
          {direction === "zh2en" ? "中 → 英" : "英 → 中"}
        </button>
      </div>

      {/* 卡片 */}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
          {item.pos ?? item.type}
        </p>
        <p className="mt-3 text-3xl font-bold leading-snug">{front}</p>

        {!revealed ? (
          <button
            type="button"
            onClick={handleReveal}
            className="mt-8 rounded-full bg-blue-600 px-8 py-3 font-medium text-white shadow-md active:scale-95"
          >
            顯示答案
          </button>
        ) : (
          <div className="mt-5 w-full">
            <p className="text-2xl font-semibold text-blue-600">{back}</p>
            {audioLine() && (
              <button
                type="button"
                onClick={() => {
                  const l = audioLine();
                  if (l) playLine(l, 1);
                }}
                className="mt-2 text-sm text-[var(--text-muted)]"
              >
                🔊 再聽一次
              </button>
            )}
            {item.examples && item.examples.length > 0 && (
              <div className="mx-auto mt-4 max-w-sm space-y-2 text-left">
                {item.examples.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => playLine(ex, 1)}
                    className="flex w-full items-start gap-2 rounded-xl bg-[var(--surface)] p-3 text-left shadow-sm"
                  >
                    <span className="text-blue-600">▶</span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{ex.en}</span>
                      <span className="block text-xs text-[var(--text-muted)]">
                        {ex.zh}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 評分 */}
      {revealed && (
        <div className="sticky bottom-0 -mx-4 grid grid-cols-3 gap-2 border-t border-[var(--border)] bg-[var(--bg)] px-4 py-3 safe-bottom">
          <GradeBtn
            label="再來"
            sub="忘了"
            className="bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
            onClick={() => handleGrade("again")}
          />
          <GradeBtn
            label="普通"
            sub="想得起來"
            className="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
            onClick={() => handleGrade("good")}
          />
          <GradeBtn
            label="熟"
            sub="很簡單"
            className="bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300"
            onClick={() => handleGrade("easy")}
          />
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/learn"
        className="rounded-full px-2 py-1 text-xl text-[var(--text-muted)]"
        aria-label="返回學習庫"
      >
        ←
      </Link>
      <h1 className="text-xl font-bold">🧠 間隔複習</h1>
    </div>
  );
}

function GradeBtn({
  label,
  sub,
  className,
  onClick,
}: {
  label: string;
  sub: string;
  className: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center rounded-2xl py-3 font-semibold active:scale-95 ${className}`}
    >
      <span>{label}</span>
      <span className="text-[10px] font-normal opacity-80">{sub}</span>
    </button>
  );
}
