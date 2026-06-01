"use client";

import { useEffect, useState } from "react";
import { getRecent, subscribeRecent } from "@/lib/storage";

export function useRecent() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(getRecent());
    return subscribeRecent(() => setRecent(getRecent()));
  }, []);

  return recent;
}
