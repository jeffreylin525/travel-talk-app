"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type FontScale,
  getFontScale,
  setFontScale as persist,
  subscribeFontScale,
} from "@/lib/settings";

export function useSettings() {
  const [fontScale, setState] = useState<FontScale>("normal");

  useEffect(() => {
    setState(getFontScale());
    return subscribeFontScale(() => setState(getFontScale()));
  }, []);

  const setFontScale = useCallback((v: FontScale) => persist(v), []);

  return { fontScale, setFontScale };
}
