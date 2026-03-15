import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import EmotionProviders from '@/app/providers/EmotionProviders';
import './globals.css';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BYTE GAME',
  description: 'The game is ready.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0a',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={geist.variable}>
        <EmotionProviders>{children}</EmotionProviders>
      </body>
    </html>
  );
}
