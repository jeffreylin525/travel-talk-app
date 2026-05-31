import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 卡片資料與音檔皆為靜態，可完全靜態化部署
  reactStrictMode: true,
};

export default nextConfig;
