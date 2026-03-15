import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import EmotionProviders from "@/app/providers/EmotionProviders";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BYTE GAME",
  description: "The game is ready.",
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
      </head>
      <body className={geist.variable}>
        <EmotionProviders>{children}</EmotionProviders>
      </body>
    </html>
  );
}
