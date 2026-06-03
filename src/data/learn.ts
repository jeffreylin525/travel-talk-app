import type { LearnItem } from "@/lib/learn-types";
import frames from "./learn/frames.json";
import frames2 from "./learn/frames2.json";
import food from "./learn/food.json";
import food2 from "./learn/food2.json";
import medical from "./learn/medical.json";
import medical2 from "./learn/medical2.json";
import directions from "./learn/directions.json";
import directions2 from "./learn/directions2.json";
import money from "./learn/money.json";
import money2 from "./learn/money2.json";
import time from "./learn/time.json";
import time2 from "./learn/time2.json";
import transport from "./learn/transport.json";
import transport2 from "./learn/transport2.json";
import smalltalk from "./learn/smalltalk.json";
import coreverb from "./learn/coreverb.json";
import corenoun from "./learn/corenoun.json";
import coreadj from "./learn/coreadj.json";
import corefunc from "./learn/corefunc.json";
import customs from "./learn/customs.json";
import signs from "./learn/signs.json";
import street from "./learn/street.json";
import lodging from "./learn/lodging.json";
import store from "./learn/store.json";
import medlabel from "./learn/medlabel.json";
import attractions from "./learn/attractions.json";
import connect from "./learn/connect.json";
import menu from "./learn/menu.json";
import idioms from "./learn/idioms.json";

// 逐類加入：完成新分類後，import 進來並加進下面的陣列即可。
const ALL_ITEMS: LearnItem[] = [
  ...(frames as LearnItem[]),
  ...(frames2 as LearnItem[]),
  ...(food as LearnItem[]),
  ...(food2 as LearnItem[]),
  ...(medical as LearnItem[]),
  ...(medical2 as LearnItem[]),
  ...(directions as LearnItem[]),
  ...(directions2 as LearnItem[]),
  ...(money as LearnItem[]),
  ...(money2 as LearnItem[]),
  ...(time as LearnItem[]),
  ...(time2 as LearnItem[]),
  ...(transport as LearnItem[]),
  ...(transport2 as LearnItem[]),
  ...(smalltalk as LearnItem[]),
  ...(coreverb as LearnItem[]),
  ...(corenoun as LearnItem[]),
  ...(coreadj as LearnItem[]),
  ...(corefunc as LearnItem[]),
  ...(customs as LearnItem[]),
  ...(signs as LearnItem[]),
  ...(street as LearnItem[]),
  ...(lodging as LearnItem[]),
  ...(store as LearnItem[]),
  ...(medlabel as LearnItem[]),
  ...(attractions as LearnItem[]),
  ...(connect as LearnItem[]),
  ...(menu as LearnItem[]),
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
