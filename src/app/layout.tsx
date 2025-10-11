import './globals.css';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { I18nProvider } from '@/lib/i18n-provider';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { SessionProvider } from '@/components/session-provider';
import { getCurrentLocale } from '@/lib/i18n';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Promptverse',
  description: 'Red social de prompts con IA',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const locale = getCurrentLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn('min-h-screen bg-muted', inter.className)}>
        <SessionProvider>
          <I18nProvider>
            <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <div className="flex flex-1">
                  <Sidebar />
                  <main className="flex-1 bg-white/70 px-6 pb-12 pt-8 dark:bg-slate-900/40">{children}</main>
                </div>
              </div>
              <Toaster position="top-right" />
            </ThemeProvider>
          </I18nProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
