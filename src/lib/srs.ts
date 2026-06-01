// 間隔重複複習引擎（SM-2 精簡版），存在 localStorage。
// 三個評分：again（忘了）/ good（普通）/ easy（很熟）。

export type Grade = "again" | "good" | "easy";

export interface SrsState {
  ease: number; // 難易係數，初始 2.5，最低 1.3
  interval: number; // 距離下次複習的天數
  reps: number; // 連續答對次數
  due: number; // 下次到期時間（ms timestamp）
  lapses: number; // 忘記次數
  added: number; // 加入複習的時間
}

const KEY = "tt:srs";
const EVENT = "tt:change:srs";
const DAY = 86400000;
const MATURE_DAYS = 21; // interval >= 21 天視為「已熟」
const isBrowser = typeof window !== "undefined";

type SrsMap = Record<string, SrsState>;

function read(): SrsMap {
  if (!isBrowser) return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SrsMap) : {};
  } catch {
    return {};
  }
}

function write(map: SrsMap) {
  if (!isBrowser) return;
  window.localStorage.setItem(KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent(EVENT));
}

function fresh(): SrsState {
  return {
    ease: 2.5,
    interval: 0,
    reps: 0,
    due: Date.now(),
    lapses: 0,
    added: Date.now(),
  };
}

export function getSrsMap(): SrsMap {
  return read();
}

export function isInDeck(id: string): boolean {
  return Boolean(read()[id]);
}

export function isMature(s: SrsState): boolean {
  return s.interval >= MATURE_DAYS;
}

export function addToDeck(id: string) {
  const map = read();
  if (!map[id]) {
    map[id] = fresh();
    write(map);
  }
}

export function removeFromDeck(id: string) {
  const map = read();
  if (map[id]) {
    delete map[id];
    write(map);
  }
}

export function toggleDeck(id: string): boolean {
  const map = read();
  if (map[id]) {
    delete map[id];
    write(map);
    return false;
  }
  map[id] = fresh();
  write(map);
  return true;
}

/** 批次加入（整個分類） */
export function addManyToDeck(ids: string[]) {
  const map = read();
  let changed = false;
  for (const id of ids) {
    if (!map[id]) {
      map[id] = fresh();
      changed = true;
    }
  }
  if (changed) write(map);
}

/** 依評分更新排程 */
export function review(id: string, grade: Grade) {
  const map = read();
  const s = map[id] ?? fresh();

  if (grade === "again") {
    s.reps = 0;
    s.lapses += 1;
    s.ease = Math.max(1.3, s.ease - 0.2);
    s.interval = 0;
    s.due = Date.now() + 10 * 60 * 1000; // 10 分鐘後再來（同次複習會再出現）
  } else if (grade === "good") {
    if (s.reps === 0) s.interval = 1;
    else if (s.reps === 1) s.interval = 3;
    else s.interval = Math.round(s.interval * s.ease);
    s.reps += 1;
    s.due = Date.now() + s.interval * DAY;
  } else {
    // easy
    if (s.reps === 0) s.interval = 3;
    else s.interval = Math.round(Math.max(s.interval, 1) * s.ease * 1.3);
    s.reps += 1;
    s.ease += 0.15;
    s.due = Date.now() + s.interval * DAY;
  }

  map[id] = s;
  write(map);
}

/** 在指定 ids 中，找出已到期（在複習庫且 due<=now）的，依到期時間排序 */
export function getDueIds(ids: string[]): string[] {
  const map = read();
  const now = Date.now();
  return ids
    .filter((id) => map[id] && map[id].due <= now)
    .sort((a, b) => map[a].due - map[b].due);
}

export interface DeckStats {
  total: number;
  inDeck: number;
  mature: number;
  learning: number; // 在庫但未成熟
  due: number;
  notAdded: number;
}

export function deckStats(ids: string[]): DeckStats {
  const map = read();
  const now = Date.now();
  let inDeck = 0;
  let mature = 0;
  let due = 0;
  for (const id of ids) {
    const s = map[id];
    if (!s) continue;
    inDeck++;
    if (isMature(s)) mature++;
    if (s.due <= now) due++;
  }
  return {
    total: ids.length,
    inDeck,
    mature,
    learning: inDeck - mature,
    due,
    notAdded: ids.length - inDeck,
  };
}

export function subscribeSrs(cb: () => void): () => void {
  if (!isBrowser) return () => {};
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
