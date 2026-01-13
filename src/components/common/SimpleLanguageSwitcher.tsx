'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe } from 'lucide-react';

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

interface SimpleLanguageSwitcherProps {
  className?: string;
  variant?: 'default' | 'compact';
  position?: 'left' | 'right';
}

export default function SimpleLanguageSwitcher({ 
  className = '', 
  variant = 'default',
  position = 'right'
}: SimpleLanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('quantaureum-global-language');
    if (savedLanguage) {
      const lang = languages.find(l => l.code === savedLanguage);
      if (lang) {
        setCurrentLanguage(lang);
        applyLanguage(lang.code);
      }
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      const detectedLang = languages.find(l => l.code === browserLang);
      if (detectedLang) {
        setCurrentLanguage(detectedLang);
        applyLanguage(detectedLang.code);
      }
    }

    // Listen for language changes from other parts of the website
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'quantaureum-global-language' && e.newValue) {
        const lang = languages.find(l => l.code === e.newValue);
        if (lang) {
          setCurrentLanguage(lang);
          applyLanguage(e.newValue);
        }
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'GLOBAL_LANGUAGE_CHANGE') {
        const lang = languages.find(l => l.code === event.data.language);
        if (lang) {
          setCurrentLanguage(lang);
          applyLanguage(event.data.language);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const applyLanguage = (languageCode: string) => {
    // Save to localStorage
    localStorage.setItem('quantaureum-global-language', languageCode);
    
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

  const handleLanguageChange = (language: typeof languages[0]) => {
    setCurrentLanguage(language);
    applyLanguage(language.code);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
          aria-label="Change language"
        >
          <Globe className="w-5 h-5 text-white" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`absolute ${position === 'right' ? 'right-0' : 'left-0'} top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50`}
            >
              <div className="p-2">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                      currentLanguage.code === language.code
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium">{language.nativeName}</div>
                      <div className="text-xs opacity-70">{language.name}</div>
                    </div>
                    {currentLanguage.code === language.code && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
        aria-label="Change language"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-sm font-medium text-white">{currentLanguage.code.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${position === 'right' ? 'right-0' : 'left-0'} top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50`}
          >
            <div className="p-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                    currentLanguage.code === language.code
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium">{language.nativeName}</div>
                    <div className="text-xs opacity-70">{language.name}</div>
                  </div>
                  {currentLanguage.code === language.code && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
