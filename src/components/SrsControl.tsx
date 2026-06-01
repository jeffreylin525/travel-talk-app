"use client";

import { useSrs } from "@/hooks/useSrs";

// 加入／移出複習庫的開關。
export default function SrsControl({ id }: { id: string }) {
  const { isInDeck, toggleDeck } = useSrs();
  const inDeck = isInDeck(id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleDeck(id);
      }}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition active:scale-95 ${
        inDeck
          ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
          : "border-[var(--border)] text-[var(--text-muted)]"
      }`}
    >
      {inDeck ? "✓ 複習中" : "➕ 加入複習"}
    </button>
  );
}
