"use client";

import { useMemo, useState } from "react";
import { searchCards } from "@/data/cards";
import ConversationCard from "@/components/ConversationCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchCards(query), [query]);

  return (
    <div className="px-4 pt-4">
      <h1 className="mb-3 text-xl font-bold">搜尋</h1>

      <div className="sticky top-0 z-10 -mx-4 bg-[var(--bg)] px-4 pb-3 pt-1">
        <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-sm">
          <span className="text-lg">🔍</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="中英文都可（計程車 / taxi / 過敏…）"
            className="w-full bg-transparent text-base outline-none placeholder:text-[var(--text-muted)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-[var(--text-muted)]"
              aria-label="清除"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {query.trim() === "" ? (
        <p className="mt-10 text-center text-sm text-[var(--text-muted)]">
          輸入關鍵字，跨所有情境搜尋。
        </p>
      ) : results.length === 0 ? (
        <p className="mt-10 text-center text-sm text-[var(--text-muted)]">
          找不到「{query}」相關的句子。
        </p>
      ) : (
        <>
          <p className="mb-3 mt-1 text-xs text-[var(--text-muted)]">
            {results.length} 筆結果
          </p>
          <div className="flex flex-col gap-3">
            {results.map((card) => (
              <ConversationCard key={card.id} card={card} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
