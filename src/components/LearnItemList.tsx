"use client";

import Link from "next/link";
import { useState } from "react";
import type { LearnItem } from "@/lib/learn-types";
import { useSrs } from "@/hooks/useSrs";
import { isMature } from "@/lib/srs";
import LearnItemCard from "./LearnItemCard";

type Filter = "all" | "learning" | "mature" | "new";

export default function LearnItemList({ items }: { items: LearnItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const { map, stats, addMany } = useSrs();

  const ids = items.map((i) => i.id);
  const s = stats(ids);
  const pct = s.total > 0 ? Math.round((s.mature / s.total) * 100) : 0;

  const match = (id: string, f: Filter) => {
    const st = map[id];
    if (f === "all") return true;
    if (f === "new") return !st;
    if (f === "mature") return st && isMature(st);
    if (f === "learning") return st && !isMature(st);
    return true;
  };

  const filtered = items.filter((i) => match(i.id, filter));

  const chips: { value: Filter; label: string }[] = [
    { value: "all", label: `全部 ${s.total}` },
    { value: "learning", label: `複習中 ${s.learning}` },
    { value: "mature", label: `已熟 ${s.mature}` },
    { value: "new", label: `未加入 ${s.notAdded}` },
  ];

  return (
    <>
      {/* 成熟度進度條 */}
      <div className="mb-3">
        <div className="mb-1 flex justify-between text-xs text-[var(--text-muted)]">
          <span>已熟練度</span>
          <span>
            {s.mature}/{s.total}（{pct}%）
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* 動作列 */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {s.notAdded > 0 && (
          <button
            type="button"
            onClick={() => addMany(ids)}
            className="rounded-full bg-violet-600 px-3 py-1 text-sm font-medium text-white active:scale-95"
          >
            ➕ 全部加入複習
          </button>
        )}
        {s.due > 0 && (
          <Link
            href="/learn/review"
            className="rounded-full border border-violet-500 px-3 py-1 text-sm font-medium text-violet-700 dark:text-violet-300"
          >
            今日待複習 {s.due} 張 →
          </Link>
        )}
      </div>

      {/* 篩選 */}
      <div className="mb-4 flex flex-wrap gap-2">
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
          這個篩選下沒有項目。
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
