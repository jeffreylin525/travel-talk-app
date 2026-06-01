import Link from "next/link";
import { SCENARIOS } from "@/data/scenarios";
import { countByScenario } from "@/data/cards";

export default function HomePage() {
  return (
    <div className="px-4 pt-6">
      <header className="mb-5 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">旅遊會話通</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            出國常用英文，點圖示挑情境，或直接搜尋。
          </p>
        </div>
        <Link
          href="/settings"
          aria-label="設定"
          className="shrink-0 rounded-full p-2 text-2xl"
        >
          ⚙️
        </Link>
      </header>

      {/* 搜尋入口 */}
      <Link
        href="/search"
        className="mb-6 flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-muted)] shadow-sm"
      >
        <span className="text-lg">🔍</span>
        <span className="text-sm">搜尋中英文（例：計程車、restroom）</span>
      </Link>

      {/* 情境大圖示 */}
      <div className="grid grid-cols-2 gap-3">
        {SCENARIOS.map((s) => {
          const count = countByScenario(s.id);
          return (
            <Link
              key={s.id}
              href={`/scenario/${s.id}`}
              className={`flex flex-col gap-2 rounded-3xl bg-gradient-to-br ${s.color} p-4 text-white shadow-md transition active:scale-[0.97]`}
            >
              <span className="text-4xl">{s.emoji}</span>
              <span className="text-lg font-bold leading-tight">{s.zh}</span>
              <span className="text-xs text-white/85">{s.desc}</span>
              <span className="mt-1 text-xs font-medium text-white/75">
                {count > 0 ? `${count} 句` : "即將推出"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
