"use client";

import Link from "next/link";
import { useRecent } from "@/hooks/useRecent";
import { getCardById } from "@/data/cards";
import { clearRecent } from "@/lib/storage";
import ConversationCard from "@/components/ConversationCard";

export default function RecentPage() {
  const recent = useRecent();
  const cards = recent
    .map((id) => getCardById(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="px-4 pt-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">🕘 最近瀏覽</h1>
        {cards.length > 0 && (
          <button
            type="button"
            onClick={clearRecent}
            className="text-sm text-[var(--text-muted)]"
          >
            清除
          </button>
        )}
      </div>

      {cards.length === 0 ? (
        <div className="mt-16 text-center text-[var(--text-muted)]">
          <p className="text-4xl">🕘</p>
          <p className="mt-3 text-sm">
            還沒有瀏覽紀錄。
            <br />
            點開任何一張卡片，就會出現在這裡。
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white"
          >
            去逛逛
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {cards.map((card) => (
            <ConversationCard key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
