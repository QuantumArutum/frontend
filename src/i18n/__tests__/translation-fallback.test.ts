/**
 * Translation Fallback Tests
 * 
 * Property 2: Fallback to English
 * For any translation key that is missing or empty in a non-English locale, 
 * the translation system must return the corresponding English translation 
 * instead of the raw key or an empty string.
 * 
 * **Validates: Requirements 1.4**
 * 
 * Feature: full-site-internationalization
 */

import * as fc from 'fast-check';
import i18n from 'i18next';
import { en } from '../locales/en';
import { zh } from '../locales/zh';
import { ja } from '../locales/ja';
import { ko } from '../locales/ko';
import { es } from '../locales/es';
import { fr } from '../locales/fr';
import { de } from '../locales/de';
import { ru } from '../locales/ru';
import { ar } from '../locales/ar';
import { pt } from '../locales/pt';
import { it as itLocale } from '../locales/it';
import { nl } from '../locales/nl';

// All supported locales
const locales = {
  en,
  zh,
  ja,
  ko,
  es,
  fr,
  de,
  ru,
  ar,
  pt,
  it: itLocale,
  nl
};

type LocaleCode = keyof typeof locales;
const localeNames: Record<LocaleCode, string> = {
  en: 'English',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  ru: 'Russian',
  ar: 'Arabic',
  pt: 'Portuguese',
  it: 'Italian',
  nl: 'Dutch'
};

/**
 * Recursively extracts all translation keys from a nested object
 * Returns an array of dot-notation key paths (e.g., "nav.home", "hero.title")
 */
function getAllTranslationKeys(obj: unknown, prefix = ''): string[] {
  const keys: string[] = [];
  
  if (obj === null || obj === undefined) {
    return keys;
  }
  
  if (typeof obj !== 'object') {
    return keys;
  }
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'string') {
      keys.push(fullKey);
    } else if (typeof value === 'object' && value !== null) {
      keys.push(...getAllTranslationKeys(value, fullKey));
    }
  }
  
  return keys;
}

/**
 * Gets a nested value from an object using dot notation
 */
function getNestedValue(obj: unknown, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  
  return current;
}

// Extract all keys from English locale's translation object (source of truth)
const englishKeys = getAllTranslationKeys(en.translation);

// Create a fresh i18n instance for testing (without react-i18next)
function createTestI18nInstance() {
  const testI18n = i18n.createInstance();
  testI18n.init({
    resources: locales,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    returnEmptyString: false,
    returnNull: false
  });
  return testI18n;
}

describe('Translation Fallback Mechanism', () => {
  let testI18n: typeof i18n;

  beforeEach(() => {
    testI18n = createTestI18nInstance();
  });

  /**
   * Task 18.1: 创建回退机制测试
   * Verifies that missing translations fall back to English
   * **Validates: Requirements 1.4**
   */
  describe('Task 18.1: Fallback mechanism tests', () => {
    test('i18n should be configured with English as fallback language', () => {
      const fallbackLng = testI18n.options.fallbackLng;
      // fallbackLng can be string, array, or false
      if (Array.isArray(fallbackLng)) {
        expect(fallbackLng).toContain('en');
      } else {
        expect(fallbackLng).toBe('en');
      }
    });

    test('should return English translation when key is missing in current locale', () => {
      // Create a modified locale with a missing key for testing
      const testResources = {
        en: {
          translation: {
            test: {
              existing: 'English existing',
              fallbackTest: 'English fallback value'
            }
          }
        },
        zh: {
          translation: {
            test: {
              existing: '中文存在'
              // fallbackTest is intentionally missing
            }
          }
        }
      };

      const fallbackTestI18n = i18n.createInstance();
      fallbackTestI18n.init({
        resources: testResources,
        lng: 'zh',
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false
        }
      });

      // Existing key should return Chinese
      expect(fallbackTestI18n.t('test.existing')).toBe('中文存在');
      
      // Missing key should fall back to English
      expect(fallbackTestI18n.t('test.fallbackTest')).toBe('English fallback value');
    });

    test('should return English translation when value is empty in current locale', () => {
      const testResources = {
        en: {
          translation: {
            test: {
              emptyTest: 'English value for empty'
            }
          }
        },
        zh: {
          translation: {
            test: {
              emptyTest: '' // Empty string
            }
          }
        }
      };

      const emptyTestI18n = i18n.createInstance();
      emptyTestI18n.init({
        resources: testResources,
        lng: 'zh',
        fallbackLng: 'en',
        returnEmptyString: false,
        interpolation: {
          escapeValue: false
        }
      });

      // Empty value should fall back to English
      expect(emptyTestI18n.t('test.emptyTest')).toBe('English value for empty');
    });

    test('should never return raw translation key pattern', () => {
      testI18n.changeLanguage('zh');
      
      // Test with a few known keys
      const testKeys = ['nav.home', 'hero.title', 'common.loading'];
      
      for (const key of testKeys) {
        const result = testI18n.t(key);
        // Result should not be the raw key
        expect(result).not.toBe(key);
        // Result should not contain the dot pattern of a key
        expect(result).not.toMatch(/^[a-z_]+\.[a-z_]+$/i);
      }
    });

    test('fallback should work for all non-English locales', () => {
      const nonEnglishLocales = Object.keys(locales).filter(
        (code) => code !== 'en'
      ) as LocaleCode[];

      // Test with a known English key
      const testKey = 'nav.home';

      for (const localeCode of nonEnglishLocales) {
        testI18n.changeLanguage(localeCode);
        const result = testI18n.t(testKey);
        
        // Result should either be the locale's translation or English fallback
        // It should never be the raw key
        expect(result).not.toBe(testKey);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      }
    });
  });


  /**
   * Task 18.2: Property Test - Fallback to English
   * **Property 2: Fallback to English**
   * **Feature: full-site-internationalization, Property 2: Fallback to English**
   * **Validates: Requirements 1.4**
   */
  describe('Task 18.2: Property Test - Fallback to English', () => {
    /**
     * Property-based test: For any randomly selected English key and any non-English locale,
     * the translation function should return a non-empty string that is not the raw key.
     * 
     * **Feature: full-site-internationalization, Property 2: Fallback to English**
     * **Validates: Requirements 1.4**
     */
    test('Property Test: For all English keys and non-English locales, t() returns non-empty string (not raw key)', () => {
      const nonEnglishLocales = Object.keys(locales).filter(
        (code) => code !== 'en'
      ) as LocaleCode[];

      // Create arbitraries for keys and locales
      const englishKeyArb = fc.constantFrom(...englishKeys);
      const localeArb = fc.constantFrom(...nonEnglishLocales);

      fc.assert(
        fc.property(englishKeyArb, localeArb, (key, localeCode) => {
          testI18n.changeLanguage(localeCode);
          const result = testI18n.t(key);
          
          // Result must be a string
          if (typeof result !== 'string') {
            throw new Error(
              `Translation for key "${key}" in ${localeNames[localeCode]} returned non-string: ${typeof result}`
            );
          }
          
          // Result must not be empty
          if (result.trim() === '') {
            throw new Error(
              `Translation for key "${key}" in ${localeNames[localeCode]} returned empty string`
            );
          }
          
          // Result must not be the raw key (fallback should provide English value)
          if (result === key) {
            throw new Error(
              `Translation for key "${key}" in ${localeNames[localeCode]} returned raw key instead of fallback`
            );
          }
          
          // Result should not look like a translation key pattern (contains dots between words)
          // This catches cases where the key is returned as-is
          const keyPattern = /^[a-z_]+(\.[a-z_]+)+$/i;
          if (keyPattern.test(result)) {
            throw new Error(
              `Translation for key "${key}" in ${localeNames[localeCode]} appears to be a raw key: "${result}"`
            );
          }
          
          return true;
        }),
        { numRuns: 100 } // Run at least 100 iterations as per design spec
      );
    });

    /**
     * Property-based test: For any missing key scenario, the system should fall back to English.
     * This simulates what happens when a translation is missing.
     * 
     * **Feature: full-site-internationalization, Property 2: Fallback to English**
     * **Validates: Requirements 1.4**
     */
    test('Property Test: Missing translations fall back to English value', () => {
      // Create a test scenario with intentionally missing translations
      const englishKeyArb = fc.constantFrom(...englishKeys.slice(0, 50)); // Use subset for performance
      
      fc.assert(
        fc.property(englishKeyArb, (key) => {
          // Get the English value for this key
          const englishValue = getNestedValue(en.translation, key) as string;
          
          if (!englishValue || typeof englishValue !== 'string') {
            return true; // Skip if English value is not a string
          }
          
          // Create a test instance with a locale that has this key missing
          const testResources = {
            en: en,
            testLang: {
              translation: {} // Empty translation - all keys missing
            }
          };
          
          const missingTestI18n = i18n.createInstance();
          missingTestI18n.init({
            resources: testResources,
            lng: 'testLang',
            fallbackLng: 'en',
            interpolation: {
              escapeValue: false
            }
          });
          
          const result = missingTestI18n.t(key);
          
          // Result should be the English fallback value
          if (result !== englishValue) {
            throw new Error(
              `Missing key "${key}" did not fall back to English. Expected "${englishValue}", got "${result}"`
            );
          }
          
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
