// 我的最愛 + 最近瀏覽，存在 localStorage（不需登入、可離線）。
// 透過自訂事件讓多個元件同步更新。

const FAV_KEY = "tt:favorites";
const RECENT_KEY = "tt:recent";
const RECENT_MAX = 30;

const isBrowser = typeof window !== "undefined";

function read(key: string): string[] {
  if (!isBrowser) return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(key: string, value: string[]) {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(`tt:change:${key}`));
}

// ---- 我的最愛 ----
export function getFavorites(): string[] {
  return read(FAV_KEY);
}

export function isFavorite(id: string): boolean {
  return read(FAV_KEY).includes(id);
}

export function toggleFavorite(id: string): boolean {
  const favs = read(FAV_KEY);
  const idx = favs.indexOf(id);
  if (idx >= 0) {
    favs.splice(idx, 1);
    write(FAV_KEY, favs);
    return false;
  }
  favs.unshift(id);
  write(FAV_KEY, favs);
  return true;
}

export function subscribeFavorites(cb: () => void): () => void {
  if (!isBrowser) return () => {};
  const handler = () => cb();
  window.addEventListener(`tt:change:${FAV_KEY}`, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(`tt:change:${FAV_KEY}`, handler);
    window.removeEventListener("storage", handler);
  };
}

export function clearFavorites() {
  write(FAV_KEY, []);
}

// ---- 最近瀏覽 ----
export function getRecent(): string[] {
  return read(RECENT_KEY);
}

export function pushRecent(id: string) {
  const recent = read(RECENT_KEY).filter((x) => x !== id);
  recent.unshift(id);
  write(RECENT_KEY, recent.slice(0, RECENT_MAX));
}

export function clearRecent() {
  write(RECENT_KEY, []);
}

export function subscribeRecent(cb: () => void): () => void {
  if (!isBrowser) return () => {};
  const handler = () => cb();
  window.addEventListener(`tt:change:${RECENT_KEY}`, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(`tt:change:${RECENT_KEY}`, handler);
    window.removeEventListener("storage", handler);
  };
}
