// 使用者偏好設定（字體大小），存在 localStorage。

export type FontScale = "normal" | "large" | "xl";

const KEY = "tt:fontscale";
const EVENT = "tt:change:fontscale";
const isBrowser = typeof window !== "undefined";

export const FONT_SCALES: { value: FontScale; label: string }[] = [
  { value: "normal", label: "標準" },
  { value: "large", label: "大" },
  { value: "xl", label: "特大" },
];

export function getFontScale(): FontScale {
  if (!isBrowser) return "normal";
  const v = window.localStorage.getItem(KEY);
  return v === "large" || v === "xl" ? v : "normal";
}

/** 套用到 <html data-fontscale>，CSS 的 --tt-scale 會跟著變 */
export function applyFontScale(v: FontScale) {
  if (!isBrowser) return;
  document.documentElement.dataset.fontscale = v;
}

export function setFontScale(v: FontScale) {
  if (!isBrowser) return;
  window.localStorage.setItem(KEY, v);
  applyFontScale(v);
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function subscribeFontScale(cb: () => void): () => void {
  if (!isBrowser) return () => {};
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
