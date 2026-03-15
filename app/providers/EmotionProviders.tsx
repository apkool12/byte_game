'use client';

import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { theme } from '@/app/theme/theme';

const cache = createCache({ key: 'byte-game', prepend: true });

export default function EmotionProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  );
}
