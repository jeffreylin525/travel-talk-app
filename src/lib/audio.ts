import type { Line } from "./types";

// 播放策略：
// 1. 若有預錄 mp3 → 播靜態檔（可離線、發音穩定）。
// 2. 若 mp3 不存在或載入失敗 → 自動退回瀏覽器內建語音合成（Web Speech API）。
//    這讓 App 在音檔尚未錄製前就能使用。

// 速度校正：OpenAI 預錄檔本身語速偏慢，標準播放再乘上一個倍率，
// 讓「正常速度」接近美語母語者的談話速度。preservesPitch 保持音高自然。
// 想整體再快/再慢，只要調這兩個常數即可。
const MP3_NORMAL_BOOST = 1.2; // 預錄檔標準播放倍率
const TTS_NORMAL_BOOST = 1.1; // 瀏覽器語音標準播放倍率

let currentAudio: HTMLAudioElement | null = null;

function stopAll() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

function speakWithBrowser(text: string, rate: number) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = rate * TTS_NORMAL_BOOST;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

/**
 * 播放一句英文。rate=1 為標準（已校正成接近母語語速），0.6~0.7 為慢速。
 */
export function playLine(line: Line, rate = 1): void {
  stopAll();

  if (line.audio) {
    const audio = new Audio(line.audio);
    // 保持音高自然（加速不變調）
    audio.preservesPitch = true;
    // @ts-expect-error 舊版 Safari 前綴
    audio.webkitPreservesPitch = true;
    audio.playbackRate = rate * MP3_NORMAL_BOOST;
    currentAudio = audio;
    audio.onended = () => {
      if (currentAudio === audio) currentAudio = null;
    };
    audio.onerror = () => {
      if (currentAudio === audio) currentAudio = null;
      speakWithBrowser(line.en, rate);
    };
    audio.play().catch(() => {
      speakWithBrowser(line.en, rate);
    });
    return;
  }

  speakWithBrowser(line.en, rate);
}

export function stopPlayback() {
  stopAll();
}
