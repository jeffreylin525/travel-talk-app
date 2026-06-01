// 預錄語音產生器：把所有卡片的英文句子用 OpenAI TTS 轉成靜態 mp3。
//
// 用法：
//   1. 在專案根目錄建立 .env.local 並填入 OPENAI_API_KEY=sk-...
//      （或直接 export OPENAI_API_KEY=... 再執行）
//   2. npm run tts
//
// 行為：
//   - 掃描 src/data/cards/*.json，蒐集每張卡的 main 與 replies 的 audio 路徑。
//   - 對每個尚未存在的 mp3 呼叫 OpenAI /v1/audio/speech 產生並存檔。
//   - 已存在的檔案會跳過（可重複執行、只補新句子）。

import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CARDS_DIR = join(ROOT, "src", "data", "cards");
const LEARN_DIR = join(ROOT, "src", "data", "learn");
const PUBLIC_DIR = join(ROOT, "public");

// 設定
const MODEL = "gpt-4o-mini-tts"; // 也可用 "tts-1"
const VOICE = "alloy"; // alloy / echo / fable / onyx / nova / shimmer
const FORMAT = "mp3";

// 載入 .env.local（簡易解析，不依賴套件）
function loadEnv() {
  const envPath = join(ROOT, ".env.local");
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}
loadEnv();

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error("✗ 找不到 OPENAI_API_KEY。請在 .env.local 設定後再執行。");
  process.exit(1);
}

function readJsonDir(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const file of readdirSync(dir)) {
    if (file.endsWith(".json")) {
      out.push(...JSON.parse(readFileSync(join(dir, file), "utf8")));
    }
  }
  return out;
}

// 蒐集所有 (text, audioPath)：會話卡（main + replies）與學習庫（本體 + 例句）
function collectLines() {
  const lines = [];
  const push = (line) => {
    if (line && line.audio && line.en)
      lines.push({ text: line.en, audio: line.audio });
  };

  // 會話卡
  for (const card of readJsonDir(CARDS_DIR)) {
    push(card.main);
    (card.replies ?? []).forEach(push);
  }

  // 學習庫
  for (const item of readJsonDir(LEARN_DIR)) {
    push(item); // 本體（單字有 audio，句型通常無）
    (item.examples ?? []).forEach(push);
  }

  return lines;
}

async function tts(text) {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: MODEL, voice: VOICE, input: text, response_format: FORMAT }),
  });
  if (!res.ok) {
    throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const lines = collectLines();
  let made = 0;
  let skipped = 0;

  for (const { text, audio } of lines) {
    const outPath = join(PUBLIC_DIR, audio.replace(/^\//, ""));
    if (existsSync(outPath)) {
      skipped++;
      continue;
    }
    mkdirSync(dirname(outPath), { recursive: true });
    process.stdout.write(`→ ${audio}  「${text.slice(0, 40)}」 ... `);
    try {
      const buf = await tts(text);
      writeFileSync(outPath, buf);
      made++;
      console.log("✓");
    } catch (e) {
      console.log("✗");
      console.error(`  ${e.message}`);
    }
  }

  console.log(`\n完成：新增 ${made}、跳過（已存在）${skipped}、共 ${lines.length} 句。`);
}

main();
