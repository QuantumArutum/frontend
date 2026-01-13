'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Language configuration
const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
];

interface LanguageContextType {
  currentLanguage: string;
  languages: typeof languages;
  changeLanguage: (languageCode: string) => void;
  getCurrentLanguageInfo: () => typeof languages[0];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const GlobalLanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('quantaureum-global-language');
    if (savedLanguage && languages.find(l => l.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
      applyLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      const detectedLang = languages.find(l => l.code === browserLang);
      if (detectedLang) {
        setCurrentLanguage(detectedLang.code);
        applyLanguage(detectedLang.code);
      }
    }
  }, []);

  const applyLanguage = (languageCode: string) => {
    // Apply to document
    document.documentElement.lang = languageCode;
    
    // Apply RTL for Arabic
    const rtlLanguages = ['ar'];
    const isRTL = rtlLanguages.includes(languageCode);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    
    // Apply RTL CSS class
    if (isRTL) {
      document.documentElement.classList.add('rtl-language');
    } else {
      document.documentElement.classList.remove('rtl-language');
    }
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('globalLanguageChanged', { 
      detail: { language: languageCode } 
    }));
    
    // Sync with main website if in iframe
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'GLOBAL_LANGUAGE_CHANGE',
        language: languageCode
      }, '*');
    }
  };

  const changeLanguage = (languageCode: string) => {
    if (languages.find(l => l.code === languageCode)) {
      setCurrentLanguage(languageCode);
      localStorage.setItem('quantaureum-global-language', languageCode);
      applyLanguage(languageCode);
    }
  };

  const getCurrentLanguageInfo = () => {
    return languages.find(l => l.code === currentLanguage) || languages[0];
  };

  // Listen for language changes from other parts of the website
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'quantaureum-global-language' && e.newValue) {
        setCurrentLanguage(e.newValue);
        applyLanguage(e.newValue);
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'GLOBAL_LANGUAGE_CHANGE') {
        changeLanguage(event.data.language);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('message', handleMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: LanguageContextType = {
    currentLanguage,
    languages,
    changeLanguage,
    getCurrentLanguageInfo,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useGlobalLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useGlobalLanguage must be used within a GlobalLanguageProvider');
  }
  return context;
};

export default LanguageContext;
