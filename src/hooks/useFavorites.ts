"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getFavorites,
  subscribeFavorites,
  toggleFavorite as toggle,
} from "@/lib/storage";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
    return subscribeFavorites(() => setFavorites(getFavorites()));
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const toggleFavorite = useCallback((id: string) => toggle(id), []);

  return { favorites, isFavorite, toggleFavorite };
}
