import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { translations } from '@beybladex/shared';

i18n
  .use(initReactI18next)
  .init({
    // i18next richiede il livello namespace: { it: { translation: {...} } }
    resources: {
      it: { translation: translations.it },
      en: { translation: translations.en },
    },
    lng: Localization.getLocales()[0].languageCode || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
