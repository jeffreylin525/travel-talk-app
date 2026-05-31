"use client";

import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";
import { getCardById } from "@/data/cards";
import ConversationCard from "@/components/ConversationCard";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const cards = favorites
    .map((id) => getCardById(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="px-4 pt-4">
      <h1 className="mb-4 text-xl font-bold">⭐ 我的最愛</h1>

      {cards.length === 0 ? (
        <div className="mt-16 text-center text-[var(--text-muted)]">
          <p className="text-4xl">☆</p>
          <p className="mt-3 text-sm">
            還沒有收藏。出發前先把常用的句子點 ☆ 收藏起來，
            <br />
            現場就不用一層層找。
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white"
          >
            去挑句子
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
