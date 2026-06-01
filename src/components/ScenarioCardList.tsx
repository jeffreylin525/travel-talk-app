"use client";

import { useState } from "react";
import type { Card } from "@/lib/types";
import { useProgress } from "@/hooks/useProgress";
import ConversationCard from "./ConversationCard";

type Filter = "all" | "review" | "learned";

export default function ScenarioCardList({ cards }: { cards: Card[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const { progress, countIn } = useProgress();

  const ids = cards.map((c) => c.id);
  const { learned, review, total } = countIn(ids);
  const pct = total > 0 ? Math.round((learned / total) * 100) : 0;

  const filtered = cards.filter((c) =>
    filter === "all" ? true : progress[c.id] === filter
  );

  const chips: { value: Filter; label: string }[] = [
    { value: "all", label: `全部 ${total}` },
    { value: "review", label: `待複習 ${review}` },
    { value: "learned", label: `已學 ${learned}` },
  ];

  return (
    <>
      {/* 進度條 */}
      <div className="mb-3">
        <div className="mb-1 flex justify-between text-xs text-[var(--text-muted)]">
          <span>學習進度</span>
          <span>
            {learned}/{total}（{pct}%）
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* 篩選 */}
      <div className="mb-4 flex gap-2">
        {chips.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setFilter(c.value)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              filter === c.value
                ? "bg-blue-600 text-white"
                : "border border-[var(--border)] text-[var(--text-muted)]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-[var(--text-muted)]">
          這個分類目前沒有卡片。
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((card) => (
            <ConversationCard key={card.id} card={card} />
          ))}
        </div>
      )}
    </>
  );
}
