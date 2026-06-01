"use client";

import { playLine } from "@/lib/audio";
import type { Line } from "@/lib/types";

// 慢速播放鍵（0.6 倍速），給聽不清楚或想跟讀時用。
export default function SlowPlayButton({
  line,
  rate = 0.6,
}: {
  line: Line;
  rate?: number;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        playLine(line, rate);
      }}
      aria-label="慢速播放"
      className="flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)] transition active:scale-95"
    >
      🐢 慢速
    </button>
  );
}
