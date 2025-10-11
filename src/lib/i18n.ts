import 'server-only';
import { headers } from 'next/headers';

const dictionaries = {
  es: () => import('@/locales/es').then((module) => module.default),
  en: () => import('@/locales/en').then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export async function getDictionary(locale: Locale) {
  const dictionary = await dictionaries[locale]();
  return dictionary;
}

export async function getScopedI18n(namespace: string) {
  const locale = getCurrentLocale();
  const dict = await getDictionary(locale);
  return (path: string) => dict?.[namespace]?.[path] ?? path;
}

export function getCurrentLocale(): Locale {
  const headerStore = headers();
  const locale = headerStore.get('x-language') || headerStore.get('accept-language')?.split(',')[0].split('-')[0] || 'es';
  return locale === 'en' ? 'en' : 'es';
}
