import type { Scenario } from "@/lib/types";

// 首頁情境入口。順序即為首頁顯示順序。
export const SCENARIOS: Scenario[] = [
  {
    id: "airport",
    emoji: "✈️",
    zh: "出入境 / 機場",
    en: "Airport & Immigration",
    desc: "報到、安檢、入境、行李、轉機",
    color: "from-sky-500 to-blue-600",
  },
  {
    id: "hotel",
    emoji: "🏨",
    zh: "飯店住宿",
    en: "Hotel",
    desc: "入住、退房、設施、客房問題",
    color: "from-violet-500 to-indigo-600",
  },
  {
    id: "restaurant",
    emoji: "🍽️",
    zh: "餐廳點餐",
    en: "Restaurant",
    desc: "訂位、點餐、特殊需求、結帳",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "transport",
    emoji: "🚕",
    zh: "交通",
    en: "Transport",
    desc: "計程車、地鐵、公車、租車",
    color: "from-amber-500 to-yellow-500",
  },
  {
    id: "shopping",
    emoji: "🛍️",
    zh: "購物與結帳",
    en: "Shopping",
    desc: "詢價、尺寸、試穿、付款、退稅",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "directions",
    emoji: "🧭",
    zh: "問路",
    en: "Directions",
    desc: "找路、方向、距離、地標",
    color: "from-teal-500 to-emerald-600",
  },
  {
    id: "emergency",
    emoji: "🆘",
    zh: "緊急狀況",
    en: "Emergency",
    desc: "就醫、遺失物品、報警、求助",
    color: "from-red-600 to-rose-700",
  },
  {
    id: "social",
    emoji: "💬",
    zh: "社交寒暄",
    en: "Small Talk",
    desc: "打招呼、自我介紹、客套、道別",
    color: "from-green-500 to-teal-600",
  },
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}
