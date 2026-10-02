'use client';

import React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { ToastProvider } from '@/components/ui/Toast';
import { CommandPalette } from '@/components/common/CommandPalette';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ToastProvider>
        {children}
        <CommandPalette />
        <Toaster position="bottom-right" richColors theme="dark" />
      </ToastProvider>
    </NextThemesProvider>
  );
}
