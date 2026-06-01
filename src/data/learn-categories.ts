import type { LearnCategory } from "@/lib/learn-types";

// 學習庫分類。順序即顯示順序；同 type 會在學習庫首頁分組。
export const LEARN_CATEGORIES: LearnCategory[] = [
  // ── 句型框架 ──
  {
    id: "frames",
    type: "frame",
    emoji: "🧱",
    zh: "萬用句型",
    en: "Sentence Frames",
    desc: "可替換的句型骨架，學會就能自己造句",
    color: "from-indigo-500 to-violet-600",
  },
  // ── 主題單字 ──
  {
    id: "food",
    type: "vocab",
    emoji: "🍔",
    zh: "飲食單字",
    en: "Food & Dining",
    desc: "點餐、食物、口味、結帳",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "medical",
    type: "vocab",
    emoji: "🩺",
    zh: "就醫身體",
    en: "Health & Body",
    desc: "症狀、身體部位、藥物與求助",
    color: "from-red-600 to-rose-700",
  },
  {
    id: "directions",
    type: "vocab",
    emoji: "🧭",
    zh: "方向位置",
    en: "Directions",
    desc: "方位、地標、距離",
    color: "from-teal-500 to-emerald-600",
  },
  {
    id: "money",
    type: "vocab",
    emoji: "💰",
    zh: "數字金額",
    en: "Numbers & Money",
    desc: "價格、付款、找零、退稅",
    color: "from-amber-500 to-yellow-500",
  },
  {
    id: "time",
    type: "vocab",
    emoji: "🕐",
    zh: "時間日期",
    en: "Time & Date",
    desc: "時間、星期、日期、營業時間",
    color: "from-sky-500 to-blue-600",
  },
  {
    id: "transport",
    type: "vocab",
    emoji: "🚉",
    zh: "交通工具",
    en: "Transport",
    desc: "交通方式、車站與機場設施",
    color: "from-cyan-500 to-teal-600",
  },
  // ── 慣用語 ──
  {
    id: "idioms",
    type: "phrase",
    emoji: "💡",
    zh: "旅遊慣用語",
    en: "Useful Phrases",
    desc: "高頻口語、客套、應對",
    color: "from-pink-500 to-rose-600",
  },
];

export function getLearnCategory(id: string): LearnCategory | undefined {
  return LEARN_CATEGORIES.find((c) => c.id === id);
}

// 學習庫首頁分組顯示用
export const LEARN_TYPE_LABELS: Record<string, string> = {
  frame: "句型框架",
  vocab: "主題單字",
  phrase: "慣用語",
};
