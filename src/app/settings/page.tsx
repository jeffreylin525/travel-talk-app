"use client";

import Link from "next/link";
import { useSettings } from "@/hooks/useSettings";
import { useProgress } from "@/hooks/useProgress";
import { useFavorites } from "@/hooks/useFavorites";
import { FONT_SCALES } from "@/lib/settings";
import { clearProgress } from "@/lib/progress";
import { clearFavorites, clearRecent } from "@/lib/storage";

export default function SettingsPage() {
  const { fontScale, setFontScale } = useSettings();
  const { progress } = useProgress();
  const { favorites } = useFavorites();

  const learned = Object.values(progress).filter((s) => s === "learned").length;
  const review = Object.values(progress).filter((s) => s === "review").length;

  const confirmClear = (msg: string, fn: () => void) => {
    if (window.confirm(msg)) fn();
  };

  return (
    <div className="px-4 pt-4">
      <div className="mb-5 flex items-center gap-3">
        <Link
          href="/"
          className="rounded-full px-2 py-1 text-xl text-[var(--text-muted)]"
          aria-label="返回首頁"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold">⚙️ 設定</h1>
      </div>

      {/* 字體大小 */}
      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold text-[var(--text-muted)]">
          字體大小
        </h2>
        <div className="flex gap-2">
          {FONT_SCALES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setFontScale(s.value)}
              className={`flex-1 rounded-xl py-3 font-medium transition ${
                fontScale === s.value
                  ? "bg-blue-600 text-white"
                  : "border border-[var(--border)] text-[var(--text)]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* 即時預覽 */}
        <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="tt-en font-semibold leading-snug">
            Could you help me, please?
          </p>
          <p className="tt-zh mt-0.5 text-[var(--text-muted)]">
            可以幫我一下嗎？（預覽）
          </p>
        </div>
      </section>

      {/* 學習進度總覽 */}
      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold text-[var(--text-muted)]">
          學習進度
        </h2>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
            <p className="text-2xl font-bold text-green-600">{learned}</p>
            <p className="text-xs text-[var(--text-muted)]">已學</p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
            <p className="text-2xl font-bold text-amber-600">{review}</p>
            <p className="text-xs text-[var(--text-muted)]">待複習</p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
            <p className="text-2xl font-bold">{favorites.length}</p>
            <p className="text-xs text-[var(--text-muted)]">收藏</p>
          </div>
        </div>
      </section>

      {/* 資料管理 */}
      <section>
        <h2 className="mb-2 text-sm font-semibold text-[var(--text-muted)]">
          資料管理
        </h2>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() =>
              confirmClear("確定要清除所有學習進度標記嗎？", clearProgress)
            }
            className="rounded-xl border border-[var(--border)] py-3 text-sm font-medium"
          >
            清除學習進度
          </button>
          <button
            type="button"
            onClick={() => confirmClear("確定要清除最近瀏覽紀錄嗎？", clearRecent)}
            className="rounded-xl border border-[var(--border)] py-3 text-sm font-medium"
          >
            清除最近瀏覽
          </button>
          <button
            type="button"
            onClick={() =>
              confirmClear("確定要清除所有收藏嗎？", clearFavorites)
            }
            className="rounded-xl border border-red-300 py-3 text-sm font-medium text-red-600 dark:border-red-900"
          >
            清除我的最愛
          </button>
        </div>
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          所有資料只存在這支裝置的瀏覽器中，不會上傳。
        </p>
      </section>
    </div>
  );
}
