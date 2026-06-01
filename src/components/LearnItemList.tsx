"use client";

import { useState } from "react";
import type { LearnItem } from "@/lib/learn-types";
import { useProgress } from "@/hooks/useProgress";
import LearnItemCard from "./LearnItemCard";

type Filter = "all" | "review" | "learned";

export default function LearnItemList({ items }: { items: LearnItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const { progress, countIn } = useProgress();

  const ids = items.map((i) => i.id);
  const { learned, review, total } = countIn(ids);
  const pct = total > 0 ? Math.round((learned / total) * 100) : 0;

  const filtered = items.filter((i) =>
    filter === "all" ? true : progress[i.id] === filter
  );

  const chips: { value: Filter; label: string }[] = [
    { value: "all", label: `全部 ${total}` },
    { value: "review", label: `待複習 ${review}` },
    { value: "learned", label: `已學 ${learned}` },
  ];

  return (
    <>
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
          這個分類目前沒有項目。
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((item) => (
            <LearnItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
}
