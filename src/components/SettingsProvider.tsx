"use client";

import { useEffect } from "react";
import { applyFontScale, getFontScale, subscribeFontScale } from "@/lib/settings";

// 啟動時把已儲存的字體大小套到 <html>，並訂閱後續變更。
export default function SettingsProvider() {
  useEffect(() => {
    applyFontScale(getFontScale());
    return subscribeFontScale(() => applyFontScale(getFontScale()));
  }, []);

  return null;
}
