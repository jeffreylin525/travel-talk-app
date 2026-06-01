"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type SrsState,
  addManyToDeck,
  deckStats,
  getDueIds,
  getSrsMap,
  subscribeSrs,
  toggleDeck as toggle,
} from "@/lib/srs";

export function useSrs() {
  const [map, setMap] = useState<Record<string, SrsState>>({});

  useEffect(() => {
    setMap(getSrsMap());
    return subscribeSrs(() => setMap(getSrsMap()));
  }, []);

  const isInDeck = useCallback((id: string) => Boolean(map[id]), [map]);
  const toggleDeck = useCallback((id: string) => toggle(id), []);
  const addMany = useCallback((ids: string[]) => addManyToDeck(ids), []);
  const stats = useCallback((ids: string[]) => deckStats(ids), [map]);
  const dueIds = useCallback((ids: string[]) => getDueIds(ids), [map]);

  return { map, isInDeck, toggleDeck, addMany, stats, dueIds };
}
