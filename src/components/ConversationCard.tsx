"use client";

import { useState } from "react";
import type { Card } from "@/lib/types";
import { pushRecent } from "@/lib/storage";
import PlayButton from "./PlayButton";
import FavoriteStar from "./FavoriteStar";
import BigCardModal from "./BigCardModal";

export default function ConversationCard({ card }: { card: Card }) {
  const [open, setOpen] = useState(false);

  const openBig = () => {
    pushRecent(card.id);
    setOpen(true);
  };

  return (
    <>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
        {/* 主句 */}
        <div className="flex items-start gap-3">
          <PlayButton line={card.main} size="md" />
          <button
            type="button"
            onClick={openBig}
            className="min-w-0 flex-1 text-left"
          >
            <p className="text-lg font-semibold leading-snug">{card.main.en}</p>
            <p className="mt-0.5 text-sm text-[var(--text-muted)]">
              {card.main.zh}
            </p>
          </button>
          <FavoriteStar id={card.id} />
        </div>

        {/* 對方可能的回覆 */}
        {card.replies && card.replies.length > 0 && (
          <div className="mt-3 space-y-2 border-t border-[var(--border)] pt-3 pl-1">
            {card.replies.map((r, i) => (
              <div key={i} className="flex items-start gap-3">
                <PlayButton line={r} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug text-[var(--text)]">
                    {r.en}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">{r.zh}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 放大／面交提示 */}
        <button
          type="button"
          onClick={openBig}
          className="mt-3 w-full rounded-xl bg-blue-50 py-2 text-sm font-medium text-blue-600 active:scale-[0.99] dark:bg-blue-950/50"
        >
          🔍 放大給對方看
        </button>
      </div>

      {open && <BigCardModal card={card} onClose={() => setOpen(false)} />}
    </>
  );
}
