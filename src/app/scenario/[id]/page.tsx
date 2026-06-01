import Link from "next/link";
import { notFound } from "next/navigation";
import { SCENARIOS, getScenario } from "@/data/scenarios";
import { getCardsByScenario } from "@/data/cards";
import ScenarioCardList from "@/components/ScenarioCardList";
import type { ScenarioId } from "@/lib/types";

export function generateStaticParams() {
  return SCENARIOS.map((s) => ({ id: s.id }));
}

export default async function ScenarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scenario = getScenario(id);
  if (!scenario) notFound();

  const cards = getCardsByScenario(id as ScenarioId);

  return (
    <div className="px-4 pt-4">
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/"
          className="rounded-full px-2 py-1 text-xl text-[var(--text-muted)]"
          aria-label="返回首頁"
        >
          ←
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <span>{scenario.emoji}</span>
            {scenario.zh}
          </h1>
          <p className="text-xs text-[var(--text-muted)]">{scenario.desc}</p>
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="mt-16 text-center text-[var(--text-muted)]">
          <p className="text-4xl">🛠️</p>
          <p className="mt-3">這個情境的內容即將推出。</p>
        </div>
      ) : (
        <ScenarioCardList cards={cards} />
      )}
    </div>
  );
}
