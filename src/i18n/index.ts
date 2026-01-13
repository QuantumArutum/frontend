import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { zh } from './locales/zh';
import { en } from './locales/en';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { es } from './locales/es';
import { ja } from './locales/ja';
import { ko } from './locales/ko';
import { ru } from './locales/ru';
import { ar } from './locales/ar';
import { pt } from './locales/pt';
import { it } from './locales/it';
import { nl } from './locales/nl';

// 语言资源
const resources = {
  zh,
  en,
  fr,
  de,
  es,
  ja,
  ko,
  ru,
  ar,
  pt,
  it,
  nl
};

// RTL languages list
const RTL_LANGUAGES = ['ar'];

// Helper function to check if a language is RTL
export function isRTLLanguage(languageCode: string): boolean {
  return RTL_LANGUAGES.includes(languageCode);
}

// Helper function to apply RTL direction to document
export function applyRTLDirection(languageCode: string): void {
  if (typeof document === 'undefined') return;
  
  const isRTL = isRTLLanguage(languageCode);
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = languageCode;
  
  if (isRTL) {
    document.documentElement.classList.add('rtl-language');
  } else {
    document.documentElement.classList.remove('rtl-language');
  }
}

// Detect initial language from localStorage or browser
function detectInitialLanguage(): string {
  if (typeof window === 'undefined') return 'en';
  
  // Check localStorage first
  const savedLanguage = localStorage.getItem('quantaureum-global-language');
  if (savedLanguage && resources[savedLanguage as keyof typeof resources]) {
    return savedLanguage;
  }
  
  // Check browser language
  const browserLang = navigator.language.split('-')[0];
  if (resources[browserLang as keyof typeof resources]) {
    return browserLang;
  }
  
  return 'en';
}

const initialLanguage = detectInitialLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Apply RTL direction on language change
i18n.on('languageChanged', (lng) => {
  applyRTLDirection(lng);
});

// Apply RTL direction for initial language (client-side only)
if (typeof window !== 'undefined') {
  // Use setTimeout to ensure DOM is ready
  setTimeout(() => {
    applyRTLDirection(initialLanguage);
  }, 0);
}

export default i18n;
