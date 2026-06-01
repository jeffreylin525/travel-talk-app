// 學習庫（第三層）共用型別。
// 三種內容統一用 LearnItem，以 type 區分：句型 / 單字 / 慣用語。

export type LearnType = "frame" | "vocab" | "phrase";

export interface LearnExample {
  en: string;
  zh: string;
  audio?: string; // 例句發音（預錄 mp3，無則退回瀏覽器語音）
}

export interface LearnItem {
  id: string; // 全域唯一，例：frame-001、food-001
  type: LearnType;
  category: string; // 所屬分類 id，對應 learn-categories
  en: string; // 句型骨架 / 單字 / 慣用語本體
  zh: string; // 中文意思
  audio?: string; // 本體發音（單字必備；句型通常省略，靠例句發音）
  pos?: string; // 詞性（單字用）：n. v. adj. ...
  note?: string; // 用法提示（中文）
  examples?: LearnExample[]; // 例句（句型/慣用語必備）
}

export interface LearnCategory {
  id: string;
  type: LearnType;
  emoji: string;
  zh: string;
  en: string;
  desc: string;
  color: string; // Tailwind 漸層
}
