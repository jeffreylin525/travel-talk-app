import Link from "next/link";
import {
  LEARN_CATEGORIES,
  LEARN_TYPE_LABELS,
} from "@/data/learn-categories";
import { countLearnByCategory } from "@/data/learn";
import type { LearnType } from "@/lib/learn-types";
import ReviewBanner from "@/components/ReviewBanner";

const TYPE_ORDER: LearnType[] = ["frame", "vocab", "phrase"];

export default function LearnHomePage() {
  return (
    <div className="px-4 pt-6">
      <header className="mb-5">
        <h1 className="text-2xl font-bold">📚 學習庫</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          打好句型與單字的底，現場就能自己造句、靈活應對。
        </p>
      </header>

      <ReviewBanner />

      {/* 自我測驗入口 */}
      <Link
        href="/learn/quiz"
        className="mb-6 flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-sm transition active:scale-[0.99]"
      >
        <span className="text-2xl">📝</span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold">自我測驗</span>
          <span className="block text-xs text-[var(--text-muted)]">
            中翻英、聽力選擇，檢測學習成果
          </span>
        </span>
        <span className="text-xl text-[var(--text-muted)]">›</span>
      </Link>

      {TYPE_ORDER.map((type) => {
        const cats = LEARN_CATEGORIES.filter((c) => c.type === type);
        if (cats.length === 0) return null;
        return (
          <section key={type} className="mb-6">
            <h2 className="mb-2 text-sm font-semibold text-[var(--text-muted)]">
              {LEARN_TYPE_LABELS[type]}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {cats.map((c) => {
                const count = countLearnByCategory(c.id);
                return (
                  <Link
                    key={c.id}
                    href={`/learn/${c.id}`}
                    className={`flex flex-col gap-2 rounded-3xl bg-gradient-to-br ${c.color} p-4 text-white shadow-md transition active:scale-[0.97]`}
                  >
                    <span className="text-4xl">{c.emoji}</span>
                    <span className="text-lg font-bold leading-tight">
                      {c.zh}
                    </span>
                    <span className="text-xs text-white/85">{c.desc}</span>
                    <span className="mt-1 text-xs font-medium text-white/75">
                      {count > 0 ? `${count} 項` : "即將推出"}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
