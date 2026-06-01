// 學習進度標記（已學 / 待複習），存在 localStorage。
// 兩種狀態互斥；再次點同一狀態即取消。

export type LearnStatus = "learned" | "review";

const KEY = "tt:progress";
const EVENT = "tt:change:progress";
const isBrowser = typeof window !== "undefined";

type ProgressMap = Record<string, LearnStatus>;

function read(): ProgressMap {
  if (!isBrowser) return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function write(map: ProgressMap) {
  if (!isBrowser) return;
  window.localStorage.setItem(KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function getProgress(): ProgressMap {
  return read();
}

export function getStatus(id: string): LearnStatus | undefined {
  return read()[id];
}

/** status 傳 null 代表清除標記 */
export function setStatus(id: string, status: LearnStatus | null) {
  const map = read();
  if (status === null) {
    delete map[id];
  } else {
    map[id] = status;
  }
  write(map);
}

export function clearProgress() {
  write({});
}

export function subscribeProgress(cb: () => void): () => void {
  if (!isBrowser) return () => {};
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
