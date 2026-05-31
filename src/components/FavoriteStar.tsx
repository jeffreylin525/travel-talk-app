"use client";

import { useFavorites } from "@/hooks/useFavorites";

export default function FavoriteStar({
  id,
  size = "md",
}: {
  id: string;
  size?: "md" | "lg";
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(id);
      }}
      aria-label={fav ? "取消收藏" : "加入我的最愛"}
      className={`shrink-0 transition active:scale-90 ${
        size === "lg" ? "text-4xl" : "text-2xl"
      } ${fav ? "" : "opacity-30"}`}
    >
      {fav ? "⭐" : "☆"}
    </button>
  );
}
