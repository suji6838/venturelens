import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://venturelens-bay.vercel.app"),
  title: "VentureLens AI",
  description: "AI 기반 기업 발굴과 가치 분석을 하나의 투자 워크스페이스에서 경험하세요.",
  openGraph: {
    title: "VentureLens AI",
    description: "AI 기반 기업 발굴과 가치 분석을 하나의 투자 워크스페이스에서 경험하세요.",
    url: "https://venturelens-bay.vercel.app",
    siteName: "VentureLens",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VentureLens AI",
    description: "AI 기반 기업 발굴과 가치 분석을 하나의 투자 워크스페이스에서 경험하세요.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
