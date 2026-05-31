import type { Line } from "./types";

// 播放策略：
// 1. 若有預錄 mp3 → 播靜態檔（可離線、發音穩定）。
// 2. 若 mp3 不存在或載入失敗 → 自動退回瀏覽器內建語音合成（Web Speech API）。
//    這讓 App 在音檔尚未錄製前就能使用。

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
  u.rate = rate; // 1 = 正常，0.7 = 慢速
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

/**
 * 播放一句英文。rate=1 正常、0.7 慢速。
 * 回傳 Promise，播放結束（或退回語音合成）後 resolve。
 */
export function playLine(line: Line, rate = 1): void {
  stopAll();

  if (line.audio) {
    const audio = new Audio(line.audio);
    audio.playbackRate = rate;
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
