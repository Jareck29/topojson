'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'es', label: 'ES', flag: '/images/flags/es.svg' },
  { code: 'en', label: 'EN', flag: '/images/flags/en.svg' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [active, setActive] = useState(i18n.language);

  const handleChange = async (code: string) => {
    await i18n.changeLanguage(code);
    setActive(code);
    document.cookie = `NEXT_LOCALE=${code}; path=/`;
  };

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          size="sm"
          variant={active === lang.code ? 'secondary' : 'ghost'}
          onClick={() => handleChange(lang.code)}
          className="flex items-center gap-2"
        >
          <Image src={lang.flag} alt={lang.label} width={20} height={14} className="rounded-sm" />
          {lang.label}
        </Button>
      ))}
    </div>
  );
}
