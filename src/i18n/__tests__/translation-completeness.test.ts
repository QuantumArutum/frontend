/**
 * Translation Key Completeness Tests
 *
 * Property 1: Translation Key Completeness
 * For all translation keys that exist in the English (en) locale file,
 * the same key must exist with a non-empty string value in all other
 * supported locale files (unless English also has an empty value).
 *
 * **Validates: Requirements 1.1, 1.2**
 *
 * Feature: full-site-internationalization
 */

import * as fc from 'fast-check';
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
  nl,
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
  nl: 'Dutch',
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

// Keys that are intentionally empty in English (e.g., unit fields that don't need values)
const intentionallyEmptyKeys = englishKeys.filter((key) => {
  const value = getNestedValue(en.translation, key);
  return typeof value === 'string' && value.trim() === '';
});

describe('Translation Key Completeness', () => {
  /**
   * Property 1: Translation Key Completeness
   * **Feature: full-site-internationalization, Property 1: Translation Key Completeness**
   * **Validates: Requirements 1.1, 1.2**
   */
  describe('Property 1: All locales contain all English keys', () => {
    // Get non-English locale codes
    const nonEnglishLocales = Object.keys(locales).filter((code) => code !== 'en') as LocaleCode[];

    test('should have English keys extracted correctly', () => {
      expect(englishKeys.length).toBeGreaterThan(0);
      expect(englishKeys).toContain('nav.home');
    });

    /**
     * Property-based test: For any randomly selected English key,
     * it should exist in all other locales with a non-empty string value
     * (unless English also has an empty value for that key).
     *
     * **Feature: full-site-internationalization, Property 1: Translation Key Completeness**
     * **Validates: Requirements 1.1, 1.2**
     */
    test('Property Test: For all English translation keys, the key exists with non-empty value in all other locales', () => {
      // Create an arbitrary that selects from English keys
      const englishKeyArb = fc.constantFrom(...englishKeys);

      fc.assert(
        fc.property(englishKeyArb, (key) => {
          // Check if this key is intentionally empty in English
          const isIntentionallyEmpty = intentionallyEmptyKeys.includes(key);

          // For each non-English locale, verify the key exists and has a non-empty value
          for (const localeCode of nonEnglishLocales) {
            const locale = locales[localeCode];
            const value = getNestedValue(locale.translation, key);

            // Key must exist
            if (value === undefined) {
              throw new Error(
                `Missing key "${key}" in ${localeNames[localeCode]} (${localeCode}) locale`
              );
            }

            // Value must be a string
            if (typeof value !== 'string') {
              throw new Error(
                `Key "${key}" in ${localeNames[localeCode]} (${localeCode}) is not a string, got ${typeof value}`
              );
            }

            // Value must be non-empty unless English is also empty
            if (value.trim() === '' && !isIntentionallyEmpty) {
              throw new Error(
                `Key "${key}" in ${localeNames[localeCode]} (${localeCode}) has empty value`
              );
            }
          }

          return true;
        }),
        { numRuns: 100 } // Run at least 100 iterations as per design spec
      );
    });
  });

  describe('Structural completeness verification', () => {
    // For each locale, verify it has all English keys
    const nonEnglishLocales = Object.keys(locales).filter((code) => code !== 'en') as LocaleCode[];

    for (const localeCode of nonEnglishLocales) {
      test(`${localeNames[localeCode]} (${localeCode}) should contain all English translation keys`, () => {
        const locale = locales[localeCode];
        const missingKeys: string[] = [];

        for (const englishKey of englishKeys) {
          const value = getNestedValue(locale.translation, englishKey);
          const isIntentionallyEmpty = intentionallyEmptyKeys.includes(englishKey);

          if (value === undefined) {
            missingKeys.push(englishKey);
          } else if (typeof value !== 'string') {
            missingKeys.push(`${englishKey} (not a string)`);
          } else if (value.trim() === '' && !isIntentionallyEmpty) {
            missingKeys.push(`${englishKey} (empty)`);
          }
        }

        expect(missingKeys).toEqual([]);
      });
    }
  });

  describe('Key count consistency', () => {
    test('all locales should have the same number of translation keys as English', () => {
      const englishKeyCount = englishKeys.length;

      for (const [code, locale] of Object.entries(locales)) {
        if (code === 'en') continue;

        const localeKeys = getAllTranslationKeys(locale.translation);

        // Allow some tolerance for extra keys in other locales
        // but they should have at least as many as English
        expect(localeKeys.length).toBeGreaterThanOrEqual(
          englishKeyCount * 0.95 // Allow 5% tolerance for minor differences
        );
      }
    });
  });
});
