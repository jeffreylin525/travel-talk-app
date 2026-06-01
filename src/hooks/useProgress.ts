"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type LearnStatus,
  getProgress,
  setStatus as persist,
  subscribeProgress,
} from "@/lib/progress";

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, LearnStatus>>({});

  useEffect(() => {
    setProgress(getProgress());
    return subscribeProgress(() => setProgress(getProgress()));
  }, []);

  const getStatus = useCallback(
    (id: string): LearnStatus | undefined => progress[id],
    [progress]
  );

  const setStatus = useCallback(
    (id: string, status: LearnStatus | null) => persist(id, status),
    []
  );

  /** 在一組卡片 id 中統計各狀態數量 */
  const countIn = useCallback(
    (ids: string[]) => {
      let learned = 0;
      let review = 0;
      for (const id of ids) {
        if (progress[id] === "learned") learned++;
        else if (progress[id] === "review") review++;
      }
      return { learned, review, total: ids.length };
    },
    [progress]
  );

  return { progress, getStatus, setStatus, countIn };
}
