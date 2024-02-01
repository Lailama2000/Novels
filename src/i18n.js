import i18 from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

import arTranslation from './lang/ar.json';

i18.use(initReactI18next).use(LanguageDetector).init({
    resources: {
        ar: {
          translation: arTranslation,
        },
      },
      lng: document.querySelector('html').lang,
      fallbackLng: 'en',
    detection:{
        order: ['cookie','htmlTag','localStorage', 'path', 'subdomain'],
        caches:['cookie']
    },
    interpolation: {
      escapeValue: false,
    },
})
export default i18;
