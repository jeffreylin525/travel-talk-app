"use client";

import Link from "next/link";
import { useSrs } from "@/hooks/useSrs";
import { getAllLearnItems } from "@/data/learn";

// 學習庫首頁的「今日複習」提示。
export default function ReviewBanner() {
  const { stats } = useSrs();
  const ids = getAllLearnItems().map((i) => i.id);
  const s = stats(ids);

  if (s.inDeck === 0) {
    return (
      <div className="mb-5 rounded-2xl border border-dashed border-[var(--border)] px-4 py-3 text-sm text-[var(--text-muted)]">
        把要記的句型或單字點「➕ 加入複習」，這裡就會排出每天該複習的卡片。
      </div>
    );
  }

  return (
    <Link
      href="/learn/review"
      className={`mb-5 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-md transition active:scale-[0.99] ${
        s.due > 0
          ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white"
          : "border border-[var(--border)] bg-[var(--surface)]"
      }`}
    >
      <span className="text-2xl">🧠</span>
      <span className="min-w-0 flex-1">
        {s.due > 0 ? (
          <>
            <span className="block font-bold">今日待複習 {s.due} 張</span>
            <span className="block text-xs text-white/85">
              複習庫 {s.inDeck} 張，已熟 {s.mature} 張
            </span>
          </>
        ) : (
          <>
            <span className="block font-bold">今日複習完成 🎉</span>
            <span className="block text-xs text-[var(--text-muted)]">
              複習庫 {s.inDeck} 張，已熟 {s.mature} 張
            </span>
          </>
        )}
      </span>
      {s.due > 0 && <span className="text-xl">›</span>}
    </Link>
  );
}
