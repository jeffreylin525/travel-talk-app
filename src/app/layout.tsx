import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "旅遊會話通｜出國常用英文",
  description: "出國旅遊常用英文會話卡：情境分類、播放、搜尋、我的最愛，可離線使用。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "旅遊會話通",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-dvh">
        <main className="mx-auto w-full max-w-screen-sm pb-24">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
