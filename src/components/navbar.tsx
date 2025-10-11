'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import { LanguageSwitcher } from '@/components/settings/language-switcher';
import { SearchBar } from '@/components/search-bar';
import { motion } from 'framer-motion';

export function Navbar() {
  const { data: session } = useSession();
  const { t } = useTranslation('common');

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80"
    >
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-semibold text-primary">
          Promptverse
        </Link>
        <SearchBar placeholder={t('search')} />
      </div>
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        {session ? (
          <Button variant="ghost" onClick={() => signOut()}>
            {t('logout')}
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/auth/login">{t('login')}</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">{t('register')}</Link>
            </Button>
          </div>
        )}
      </div>
    </motion.header>
  );
}
