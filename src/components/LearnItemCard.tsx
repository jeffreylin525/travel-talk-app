"use client";

import type { LearnItem } from "@/lib/learn-types";
import { useProgress } from "@/hooks/useProgress";
import PlayButton from "./PlayButton";
import SlowPlayButton from "./SlowPlayButton";
import ProgressControl from "./ProgressControl";

// 學習庫卡片：句型／單字／慣用語通用。
// 句型通常沒有本體發音，靠例句發音；單字本體有發音。
export default function LearnItemCard({ item }: { item: LearnItem }) {
  const { getStatus } = useProgress();
  const status = getStatus(item.id);

  const accent =
    status === "learned"
      ? "border-l-4 border-l-green-500"
      : status === "review"
        ? "border-l-4 border-l-amber-500"
        : "";

  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm ${accent}`}
    >
      {/* 本體 */}
      <div className="flex items-start gap-3">
        {item.audio ? (
          <PlayButton
            line={{ en: item.en, zh: item.zh, audio: item.audio }}
            size="md"
          />
        ) : (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--border)] text-lg">
            🧱
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <p className="tt-en font-semibold leading-snug">{item.en}</p>
            {item.pos && (
              <span className="text-xs text-[var(--text-muted)]">
                {item.pos}
              </span>
            )}
          </div>
          <p className="tt-zh mt-0.5 text-[var(--text-muted)]">{item.zh}</p>
        </div>
      </div>

      {/* 用法提示 */}
      {item.note && (
        <p className="mt-2 rounded-xl bg-blue-50 px-3 py-2 text-xs leading-relaxed text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          💡 {item.note}
        </p>
      )}

      {/* 例句 */}
      {item.examples && item.examples.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-[var(--border)] pt-3 pl-1">
          {item.examples.map((ex, i) => (
            <div key={i} className="flex items-start gap-3">
              <PlayButton line={ex} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="tt-ren font-medium leading-snug text-[var(--text)]">
                  {ex.en}
                </p>
                <p className="tt-rzh text-[var(--text-muted)]">{ex.zh}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 控制列：慢速 + 學習標記 */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <SlowPlayButton
          line={
            item.audio
              ? { en: item.en, zh: item.zh, audio: item.audio }
              : (item.examples?.[0] ?? { en: item.en, zh: item.zh })
          }
        />
        <ProgressControl id={item.id} />
      </div>
    </div>
  );
}
