"use client";

import { useEffect } from "react";
import type { Card } from "@/lib/types";
import { playLine, stopPlayback } from "@/lib/audio";
import FavoriteStar from "./FavoriteStar";

// 面交／放大模式：超大字幕 + 超大播放鍵，
// 可把手機交給對方（司機、櫃台）看與聽。

export default function BigCardModal({
  card,
  onClose,
}: {
  card: Card;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      stopPlayback();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--bg)] safe-top safe-bottom">
      {/* 頂列 */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-4 py-2 text-base font-medium text-[var(--text-muted)]"
        >
          ✕ 關閉
        </button>
        <FavoriteStar id={card.id} size="lg" />
      </div>

      {/* 主要內容：交給對方看的大字 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center no-select">
        <p className="text-2xl font-medium leading-relaxed text-[var(--text-muted)]">
          {card.main.zh}
        </p>
        <p className="text-4xl font-bold leading-snug text-[var(--text)] sm:text-5xl">
          {card.main.en}
        </p>

        {/* 超大播放鍵 */}
        <div className="mt-2 flex items-center gap-5">
          <button
            type="button"
            onClick={() => playLine(card.main, 1)}
            aria-label="播放"
            className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-5xl text-white shadow-lg active:scale-90"
          >
            ▶
          </button>
          <button
            type="button"
            onClick={() => playLine(card.main, 0.65)}
            aria-label="慢速播放"
            className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-blue-100 text-blue-700 shadow active:scale-90 dark:bg-blue-950"
          >
            <span className="text-xl">🐢</span>
            <span className="text-[10px] font-semibold">慢</span>
          </button>
        </div>
      </div>

      {/* 對方可能的回覆 */}
      {card.replies && card.replies.length > 0 && (
        <div className="border-t border-[var(--border)] px-5 py-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            對方可能會說
          </p>
          <div className="flex flex-col gap-3">
            {card.replies.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => playLine(r, 1)}
                className="flex items-center gap-3 rounded-2xl bg-[var(--surface)] p-3 text-left shadow-sm active:scale-[0.99]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                  ▶
                </span>
                <span className="min-w-0">
                  <span className="block text-lg font-semibold">{r.en}</span>
                  <span className="block text-sm text-[var(--text-muted)]">
                    {r.zh}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
