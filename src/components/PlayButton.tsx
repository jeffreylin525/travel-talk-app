"use client";

import { useState } from "react";
import { playLine } from "@/lib/audio";
import type { Line } from "@/lib/types";

interface Props {
  line: Line;
  rate?: number;
  size?: "sm" | "md" | "lg";
  label?: string;
}

const SIZES = {
  sm: "h-9 w-9 text-base",
  md: "h-12 w-12 text-xl",
  lg: "h-20 w-20 text-4xl",
};

export default function PlayButton({ line, rate = 1, size = "md", label }: Props) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    playLine(line, rate);
    setPlaying(true);
    // 簡單的播放動畫回饋
    window.setTimeout(() => setPlaying(false), 600);
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      aria-label={label ?? "播放發音"}
      className={`flex shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition active:scale-90 ${
        SIZES[size]
      } ${playing ? "animate-pulse" : ""}`}
    >
      ▶
    </button>
  );
}
