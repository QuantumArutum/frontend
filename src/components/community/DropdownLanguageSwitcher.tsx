'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { useTranslation } from './EnhancedInternationalization';

// 支持的语言配置
const SUPPORTED_LANGUAGES = [
  { code: 'zh', name: '简体中文', nativeName: '中文', flag: '🇨🇳', region: 'China' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', region: 'United States' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'France' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Germany' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Spain' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Japan' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', region: 'South Korea' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Russia' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', region: 'Saudi Arabia' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', region: 'Vietnam' }
];

interface DropdownLanguageSwitcherProps {
  variant?: 'default' | 'compact' | 'minimal';
  showFlag?: boolean;
  showNativeName?: boolean;
  className?: string;
}

export function DropdownLanguageSwitcher({ 
  variant = 'default',
  showFlag = true,
  showNativeName = true,
  className = ''
}: DropdownLanguageSwitcherProps) {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === language) || SUPPORTED_LANGUAGES[0];

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    setIsOpen(false);

    // 更新HTML属性
    document.documentElement.lang = langCode;
    
    // RTL语言支持
    const rtlLanguages = ['ar'];
    const isRTL = rtlLanguages.includes(langCode);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    
    if (isRTL) {
      document.documentElement.classList.add('rtl-language');
    } else {
      document.documentElement.classList.remove('rtl-language');
    }

    // 保存到localStorage
    localStorage.setItem('quantaureum-language', langCode);
  };

  // 从localStorage恢复语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('quantaureum-language');
    if (savedLanguage && SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, [setLanguage]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          trigger: 'px-3 py-2 text-sm',
          dropdown: 'w-40',
          item: 'px-3 py-2 text-sm'
        };
      case 'minimal':
        return {
          trigger: 'px-2 py-1 text-xs',
          dropdown: 'w-32',
          item: 'px-2 py-1.5 text-xs'
        };
      default:
        return {
          trigger: 'px-4 py-3',
          dropdown: 'w-56',
          item: 'px-4 py-3'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 触发按钮 */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          ${styles.trigger}
          bg-white/10 hover:bg-white/20 
          border border-white/20 hover:border-white/30
          rounded-lg backdrop-blur-sm
          text-white font-medium
          flex items-center gap-3
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-purple-500/50
          ${isOpen ? 'bg-white/20 border-white/30' : ''}
        `}
      >
        {/* 全球图标 */}
        <Globe className="h-4 w-4 text-gray-300" />
        
        {/* 当前语言信息 */}
        <div className="flex items-center gap-2 flex-1">
          {showFlag && (
            <span className="text-lg" role="img" aria-label={currentLanguage.region}>
              {currentLanguage.flag}
            </span>
          )}
          <span className="truncate">
            {showNativeName ? currentLanguage.nativeName : currentLanguage.name}
          </span>
        </div>

        {/* 下拉箭头 */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </motion.div>
      </motion.button>

      {/* 下拉菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute top-full left-0 mt-2 ${styles.dropdown}
              bg-gray-900/95 backdrop-blur-md
              border border-white/20 rounded-lg
              shadow-2xl shadow-black/50
              z-50 max-h-80 overflow-y-auto
              scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
            `}
          >
            <div className="p-2">
              {/* 标题 */}
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10 mb-2">
                选择语言 / Select Language
              </div>

              {/* 语言列表 */}
              {SUPPORTED_LANGUAGES.map((lang, index) => (
                <motion.button
                  key={lang.code}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`
                    ${styles.item}
                    w-full text-left rounded-md
                    flex items-center gap-3
                    transition-all duration-200
                    ${language === lang.code 
                      ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-purple-500/30' 
                      : 'text-gray-300 hover:text-white'
                    }
                  `}
                >
                  {/* 国旗 */}
                  <span className="text-lg flex-shrink-0" role="img" aria-label={lang.region}>
                    {lang.flag}
                  </span>

                  {/* 语言信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {lang.nativeName}
                    </div>
                    {variant === 'default' && (
                      <div className="text-xs text-gray-400 truncate">
                        {lang.name} · {lang.region}
                      </div>
                    )}
                  </div>

                  {/* 选中标识 */}
                  {language === lang.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex-shrink-0"
                    >
                      <Check className="h-4 w-4 text-purple-400" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* 底部信息 */}
            <div className="border-t border-white/10 p-3">
              <div className="text-xs text-gray-500 text-center">
                🌐 Quantaureum supports {SUPPORTED_LANGUAGES.length} languages
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 紧凑版语言切换器
export function CompactLanguageSwitcher({ className = '' }: { className?: string }) {
  return (
    <DropdownLanguageSwitcher 
      variant="compact" 
      showNativeName={true}
      className={className}
    />
  );
}

// 最小版语言切换器
export function MinimalLanguageSwitcher({ className = '' }: { className?: string }) {
  return (
    <DropdownLanguageSwitcher 
      variant="minimal" 
      showFlag={true}
      showNativeName={false}
      className={className}
    />
  );
}

// 导出语言配置供其他组件使用
export { SUPPORTED_LANGUAGES };
