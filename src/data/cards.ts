import type { Card, ScenarioId } from "@/lib/types";
import airport from "./cards/airport.json";
import hotel from "./cards/hotel.json";
import restaurant from "./cards/restaurant.json";
import transport from "./cards/transport.json";
import shopping from "./cards/shopping.json";
import directions from "./cards/directions.json";
import emergency from "./cards/emergency.json";
import social from "./cards/social.json";

// 逐情境加入：完成新情境後，import 進來並加進下面的陣列即可。
const ALL_CARDS: Card[] = [
  ...(airport as Card[]),
  ...(hotel as Card[]),
  ...(restaurant as Card[]),
  ...(transport as Card[]),
  ...(shopping as Card[]),
  ...(directions as Card[]),
  ...(emergency as Card[]),
  ...(social as Card[]),
];

export function getAllCards(): Card[] {
  return ALL_CARDS;
}

export function getCardsByScenario(scenario: ScenarioId): Card[] {
  return ALL_CARDS.filter((c) => c.scenario === scenario);
}

export function getCardById(id: string): Card | undefined {
  return ALL_CARDS.find((c) => c.id === id);
}

export function countByScenario(scenario: ScenarioId): number {
  return getCardsByScenario(scenario).length;
}

/** 全域搜尋：中英文、回覆內容、tags 都比對 */
export function searchCards(query: string): Card[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ALL_CARDS.filter((c) => {
    const haystack = [
      c.main.en,
      c.main.zh,
      ...(c.replies?.flatMap((r) => [r.en, r.zh]) ?? []),
      ...(c.tags ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
