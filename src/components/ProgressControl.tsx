"use client";

import { useProgress } from "@/hooks/useProgress";

// 學習進度標記：已學 / 待複習（互斥，再點一次取消）
export default function ProgressControl({ id }: { id: string }) {
  const { getStatus, setStatus } = useProgress();
  const status = getStatus(id);

  const chip = (active: boolean, tone: "green" | "amber") => {
    const base =
      "rounded-full px-2.5 py-1 text-xs font-medium transition active:scale-95 border";
    if (!active)
      return `${base} border-[var(--border)] text-[var(--text-muted)]`;
    return tone === "green"
      ? `${base} border-green-500 bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300`
      : `${base} border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300`;
  };

  return (
    <div className="flex gap-1.5">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setStatus(id, status === "learned" ? null : "learned");
        }}
        className={chip(status === "learned", "green")}
      >
        ✓ 已學
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setStatus(id, status === "review" ? null : "review");
        }}
        className={chip(status === "review", "amber")}
      >
        🔁 待複習
      </button>
    </div>
  );
}
