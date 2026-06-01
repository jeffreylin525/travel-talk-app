"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getAllLearnItems } from "@/data/learn";
import { getSrsMap } from "@/lib/srs";
import {
  type QuizMode,
  type QuizQuestion,
  buildQuiz,
  quizPool,
} from "@/lib/quiz";
import { playLine } from "@/lib/audio";

const COUNT = 10;
type Phase = "setup" | "playing" | "done";
type Scope = "all" | "deck";

export default function QuizPage() {
  const allItems = useMemo(() => getAllLearnItems(), []);

  const [phase, setPhase] = useState<Phase>("setup");
  const [mode, setMode] = useState<QuizMode>("zh2en");
  const [scope, setScope] = useState<Scope>("all");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<QuizQuestion[]>([]);

  // 依 mode + scope 算出可用題庫
  const pool = useMemo(() => {
    const inScope =
      scope === "deck"
        ? allItems.filter((i) => getSrsMap()[i.id])
        : allItems;
    return quizPool(inScope, mode);
  }, [allItems, mode, scope]);

  const start = () => {
    const qs = buildQuiz(pool, mode, Math.min(COUNT, pool.length));
    setQuestions(qs);
    setIndex(0);
    setPicked(null);
    setScore(0);
    setWrong([]);
    setPhase("playing");
  };

  const current = questions[index];

  // 聽力題：出現時自動播音
  useEffect(() => {
    if (phase === "playing" && current?.promptAudio) {
      playLine(current.promptAudio, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index]);

  const choose = (i: number) => {
    if (picked !== null) return; // 已作答
    setPicked(i);
    if (current.options[i].correct) setScore((s) => s + 1);
    else setWrong((w) => [...w, current]);
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setPhase("done");
    } else {
      setIndex((n) => n + 1);
      setPicked(null);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col px-4 pt-4">
      <div className="flex items-center gap-3">
        <Link
          href="/learn"
          className="rounded-full px-2 py-1 text-xl text-[var(--text-muted)]"
          aria-label="返回學習庫"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold">📝 自我測驗</h1>
      </div>

      {/* ───── 設定 ───── */}
      {phase === "setup" && (
        <div className="mt-6 flex flex-col gap-6">
          <div>
            <p className="mb-2 text-sm font-semibold text-[var(--text-muted)]">
              題型
            </p>
            <div className="flex gap-2">
              <ModeBtn
                active={mode === "zh2en"}
                onClick={() => setMode("zh2en")}
                title="中翻英"
                sub="看中文選英文"
              />
              <ModeBtn
                active={mode === "listening"}
                onClick={() => setMode("listening")}
                title="聽力選擇"
                sub="聽英文選中文"
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-[var(--text-muted)]">
              範圍
            </p>
            <div className="flex gap-2">
              <ModeBtn
                active={scope === "all"}
                onClick={() => setScope("all")}
                title="全部"
                sub="所有學習庫項目"
              />
              <ModeBtn
                active={scope === "deck"}
                onClick={() => setScope("deck")}
                title="複習中"
                sub="只考加入複習的"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-muted)]">
            可出題：{pool.length} 項，每回最多考 {COUNT} 題。
          </div>

          {pool.length < 4 ? (
            <p className="text-center text-sm text-[var(--text-muted)]">
              這個範圍可用的項目不足 4 項，無法出選擇題。
              {scope === "deck" && "（試試先加入更多複習，或改成「全部」）"}
            </p>
          ) : (
            <button
              type="button"
              onClick={start}
              className="rounded-full bg-blue-600 py-3 font-medium text-white shadow-md active:scale-95"
            >
              開始測驗
            </button>
          )}
        </div>
      )}

      {/* ───── 作答 ───── */}
      {phase === "playing" && current && (
        <>
          <div className="mb-4 mt-2 text-xs text-[var(--text-muted)]">
            第 {index + 1} / {questions.length} 題・答對 {score}
          </div>

          <div className="flex flex-1 flex-col">
            {/* 題目 */}
            <div className="mb-6 text-center">
              {current.mode === "zh2en" ? (
                <p className="text-2xl font-bold leading-snug">
                  {current.promptText}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    current.promptAudio && playLine(current.promptAudio, 1)
                  }
                  className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-4xl text-white shadow-lg active:scale-95"
                  aria-label="播放題目"
                >
                  🔊
                </button>
              )}
              {current.mode === "listening" && (
                <p className="mt-3 text-sm text-[var(--text-muted)]">
                  聽英文，選出正確的中文意思
                </p>
              )}
            </div>

            {/* 選項 */}
            <div className="flex flex-col gap-2">
              {current.options.map((opt, i) => {
                let cls =
                  "border-[var(--border)] bg-[var(--surface)] text-[var(--text)]";
                if (picked !== null) {
                  if (opt.correct)
                    cls =
                      "border-green-500 bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300";
                  else if (i === picked)
                    cls =
                      "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300";
                  else cls = "border-[var(--border)] text-[var(--text-muted)]";
                }
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => choose(i)}
                    disabled={picked !== null}
                    className={`rounded-2xl border px-4 py-3 text-left font-medium transition active:scale-[0.99] ${cls}`}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 下一題 */}
          {picked !== null && (
            <div className="sticky bottom-0 -mx-4 border-t border-[var(--border)] bg-[var(--bg)] px-4 py-3 safe-bottom">
              <button
                type="button"
                onClick={next}
                className="w-full rounded-full bg-blue-600 py-3 font-medium text-white active:scale-95"
              >
                {index + 1 >= questions.length ? "看成績" : "下一題"}
              </button>
            </div>
          )}
        </>
      )}

      {/* ───── 結果 ───── */}
      {phase === "done" && (
        <div className="mt-6">
          <div className="text-center">
            <p className="text-5xl">
              {score === questions.length ? "🏆" : score >= questions.length * 0.6 ? "👍" : "💪"}
            </p>
            <p className="mt-3 text-2xl font-bold">
              {score} / {questions.length}
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {score === questions.length
                ? "全對，太強了！"
                : "答錯的整理在下面，再看一次。"}
            </p>
          </div>

          {wrong.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold text-[var(--text-muted)]">
                答錯的 {wrong.length} 題
              </p>
              <div className="flex flex-col gap-2">
                {wrong.map((q, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3"
                  >
                    <p className="font-semibold">{q.answerEn}</p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {q.answerZh}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => setPhase("setup")}
              className="flex-1 rounded-full border border-[var(--border)] py-3 font-medium"
            >
              再測一次
            </button>
            <Link
              href="/learn"
              className="flex-1 rounded-full bg-blue-600 py-3 text-center font-medium text-white"
            >
              回學習庫
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function ModeBtn({
  active,
  onClick,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col rounded-2xl border px-4 py-3 text-left transition ${
        active
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-[var(--border)] text-[var(--text)]"
      }`}
    >
      <span className="font-semibold">{title}</span>
      <span
        className={`text-xs ${active ? "text-white/85" : "text-[var(--text-muted)]"}`}
      >
        {sub}
      </span>
    </button>
  );
}
