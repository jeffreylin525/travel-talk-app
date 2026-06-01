import type { LearnItem } from "@/lib/learn-types";
import frames from "./learn/frames.json";
import frames2 from "./learn/frames2.json";
import food from "./learn/food.json";
import medical from "./learn/medical.json";
import directions from "./learn/directions.json";
import money from "./learn/money.json";
import time from "./learn/time.json";
import transport from "./learn/transport.json";
import idioms from "./learn/idioms.json";

// 逐類加入：完成新分類後，import 進來並加進下面的陣列即可。
const ALL_ITEMS: LearnItem[] = [
  ...(frames as LearnItem[]),
  ...(frames2 as LearnItem[]),
  ...(food as LearnItem[]),
  ...(medical as LearnItem[]),
  ...(directions as LearnItem[]),
  ...(money as LearnItem[]),
  ...(time as LearnItem[]),
  ...(transport as LearnItem[]),
  ...(idioms as LearnItem[]),
];

export function getAllLearnItems(): LearnItem[] {
  return ALL_ITEMS;
}

export function getLearnItemsByCategory(category: string): LearnItem[] {
  return ALL_ITEMS.filter((i) => i.category === category);
}

export function getLearnItemById(id: string): LearnItem | undefined {
  return ALL_ITEMS.find((i) => i.id === id);
}

export function countLearnByCategory(category: string): number {
  return getLearnItemsByCategory(category).length;
}

/** 學習庫內搜尋：本體、意思、例句、提示都比對 */
export function searchLearnItems(query: string): LearnItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ALL_ITEMS.filter((i) => {
    const haystack = [
      i.en,
      i.zh,
      i.note ?? "",
      ...(i.examples?.flatMap((e) => [e.en, e.zh]) ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
