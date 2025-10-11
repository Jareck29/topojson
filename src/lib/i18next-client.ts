'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from '@/locales/resources';

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    resources,
    fallbackLng: 'es',
    lng: 'es',
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'common',
  });
}

export default i18next;
