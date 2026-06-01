import Link from "next/link";
import { notFound } from "next/navigation";
import { LEARN_CATEGORIES, getLearnCategory } from "@/data/learn-categories";
import { getLearnItemsByCategory } from "@/data/learn";
import LearnItemList from "@/components/LearnItemList";

export function generateStaticParams() {
  return LEARN_CATEGORIES.map((c) => ({ category: c.id }));
}

export default async function LearnCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getLearnCategory(category);
  if (!cat) notFound();

  const items = getLearnItemsByCategory(category);

  return (
    <div className="px-4 pt-4">
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/learn"
          className="rounded-full px-2 py-1 text-xl text-[var(--text-muted)]"
          aria-label="返回學習庫"
        >
          ←
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <span>{cat.emoji}</span>
            {cat.zh}
          </h1>
          <p className="text-xs text-[var(--text-muted)]">{cat.desc}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-16 text-center text-[var(--text-muted)]">
          <p className="text-4xl">🛠️</p>
          <p className="mt-3">這個分類的內容即將推出。</p>
        </div>
      ) : (
        <LearnItemList items={items} />
      )}
    </div>
  );
}
