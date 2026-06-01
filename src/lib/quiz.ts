// 自我測驗出題邏輯（純函式，不碰儲存）。
import type { LearnItem } from "./learn-types";
import type { Line } from "./types";

export type QuizMode = "zh2en" | "listening";

export interface QuizOption {
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  itemId: string;
  mode: QuizMode;
  promptText: string; // 中翻英：顯示中文；聽力：留空，改播音
  promptAudio?: Line; // 聽力題要播的音
  options: QuizOption[];
  answerEn: string;
  answerZh: string;
}

function shuffle<T>(arr: T[]): T[] {
  const r = [...arr];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

/** 聽力題只用「本體有發音」的項目（單字）；中翻英全可用。 */
export function quizPool(items: LearnItem[], mode: QuizMode): LearnItem[] {
  return mode === "listening" ? items.filter((i) => i.audio) : items;
}

export function buildQuiz(
  pool: LearnItem[],
  mode: QuizMode,
  count: number
): QuizQuestion[] {
  const picked = shuffle(pool).slice(0, count);
  const key = (o: LearnItem) => (mode === "zh2en" ? o.en : o.zh);

  return picked.map((it) => {
    const others = pool.filter((o) => o.id !== it.id);
    const sameCat = others.filter((o) => o.category === it.category);
    const distractorPool = sameCat.length >= 3 ? sameCat : others;
    const distractors = shuffle(distractorPool).slice(0, 3);

    const options = shuffle([
      { text: key(it), correct: true },
      ...distractors.map((d) => ({ text: key(d), correct: false })),
    ]);

    const promptAudio: Line | undefined =
      mode === "listening"
        ? it.audio
          ? { en: it.en, zh: it.zh, audio: it.audio }
          : it.examples?.[0]
        : undefined;

    return {
      itemId: it.id,
      mode,
      promptText: mode === "zh2en" ? it.zh : "",
      promptAudio,
      options,
      answerEn: it.en,
      answerZh: it.zh,
    };
  });
}
