# 旅遊會話通（Travel Talk）

出國旅遊常用英文會話 App。情境分類瀏覽 → 中英文卡片 + 播放鍵 → 全域搜尋（中英）→ 我的最愛 → 離線可用。
針對「實用會話」設計，不講究學術文法。

## 特色

- **情境分類首頁**：機場、飯店、餐廳、交通、購物、問路、緊急、社交（大圖示 + 中文標籤）。
- **會話卡**：每張卡含「你要說的話」＋「對方最可能的回覆」，中英對照，各句可獨立播放。
- **放大給對方看（面交模式）**：點卡片進入全螢幕超大字 + 超大播放鍵，把手機交給司機／櫃台看與聽。
- **全域搜尋**：中英文、回覆內容、關鍵字都能搜。
- **我的最愛**：出發前先收藏常用句，現場直接打開。
- **離線**：卡片內建於程式，音檔為靜態檔，可加到手機主畫面像 App。
- **播放策略**：有預錄 mp3 就播 mp3；尚未錄製時自動退回瀏覽器內建語音，**現在就能用**。慢速播放用 `playbackRate`，不需另錄。

## 開發

```bash
npm install
npm run dev      # http://localhost:3000
```

## 預錄語音（OpenAI TTS）

```bash
cp .env.example .env.local   # 填入 OPENAI_API_KEY
npm run tts                  # 產生 public/audio/**/*.mp3（已存在的會跳過）
```

## 新增情境內容

1. 在 `src/data/cards/` 新增 `<scenario>.json`（格式參考 `airport.json`）。
2. 到 `src/data/cards.ts` import 並加進 `ALL_CARDS`。
3. `npm run tts` 補產生新句子的音檔。

情境清單與圖示定義在 `src/data/scenarios.ts`。

## 部署

GitHub → Vercel 自動部署（push `main` 即觸發）。
