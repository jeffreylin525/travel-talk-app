// 共用型別定義

export type ScenarioId =
  | "airport" // 出入境 / 機場
  | "hotel" // 飯店住宿
  | "restaurant" // 餐廳點餐
  | "transport" // 交通（計程車、地鐵、租車）
  | "shopping" // 購物與結帳
  | "directions" // 問路
  | "emergency" // 緊急狀況（就醫、遺失、報警）
  | "social"; // 一般社交寒暄

export interface Scenario {
  id: ScenarioId;
  emoji: string; // 首頁大圖示
  zh: string; // 中文標籤
  en: string; // 英文標籤
  desc: string; // 一句話說明
  color: string; // 卡片主題色（Tailwind 漸層用）
}

/** 一句話：你說的，或對方可能的回覆 */
export interface Line {
  en: string;
  zh: string;
  audio?: string; // 預錄 mp3 路徑，例：/audio/airport/airport-001.mp3
}

/** 一張會話卡：一句主要的話，加上對方最可能的回覆（答案或反問） */
export interface Card {
  id: string; // 全域唯一，例：airport-001
  scenario: ScenarioId;
  main: Line; // 你要說的話
  replies?: Line[]; // 對方最可能的回覆（0~3 句）
  tags?: string[]; // 額外搜尋關鍵字（中英皆可）
}
