import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import EmotionProviders from "@/app/providers/EmotionProviders";
import { APP_DESCRIPTION, APP_NAME } from "@/data/app";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1F0C0C",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="theme-color" content="#1F0C0C" />
        <link rel="preload" href="/byte_game_logo.svg" as="image" />
      </head>
      <body className={geist.variable}>
        <EmotionProviders>{children}</EmotionProviders>
      </body>
    </html>
  );
}
