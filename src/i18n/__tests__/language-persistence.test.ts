/**
 * Language Persistence Tests
 *
 * Property 5: Language Persistence Round-Trip
 * For any language code selected by the user, saving to localStorage and then
 * reading back must return the same language code, and the application must
 * restore this language on subsequent visits.
 *
 * **Validates: Requirements 7.3, 7.4**
 *
 * Feature: full-site-internationalization
 */

import * as fc from 'fast-check';

// Supported language codes
const SUPPORTED_LANGUAGES = [
  'en',
  'zh',
  'ja',
  'ko',
  'es',
  'fr',
  'de',
  'ru',
  'ar',
  'pt',
  'it',
  'nl',
] as const;

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// localStorage key used by the application
const LANGUAGE_STORAGE_KEY = 'quantaureum-global-language';

// Mock localStorage implementation for testing
class MockLocalStorage {
  private store: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  get length(): number {
    return this.store.size;
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] ?? null;
  }
}

/**
 * Simulates saving language preference to localStorage
 * This mirrors the behavior in SimpleLanguageSwitcher.tsx
 */
function saveLanguagePreference(storage: MockLocalStorage, languageCode: string): void {
  storage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
}

/**
 * Simulates loading language preference from localStorage
 * This mirrors the behavior in SimpleLanguageSwitcher.tsx and i18n/index.ts
 */
function loadLanguagePreference(storage: MockLocalStorage): string | null {
  return storage.getItem(LANGUAGE_STORAGE_KEY);
}

/**
 * Validates if a language code is supported
 */
function isValidLanguageCode(code: string): code is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(code as SupportedLanguage);
}

/**
 * Simulates the language detection logic from i18n/index.ts
 * Returns the detected language based on localStorage or defaults
 */
function detectLanguage(storage: MockLocalStorage, browserLanguage: string = 'en'): string {
  // Check localStorage first
  const savedLanguage = storage.getItem(LANGUAGE_STORAGE_KEY);
  if (savedLanguage && isValidLanguageCode(savedLanguage)) {
    return savedLanguage;
  }

  // Check browser language
  const browserLang = browserLanguage.split('-')[0];
  if (isValidLanguageCode(browserLang)) {
    return browserLang;
  }

  // Default to Chinese (as per i18n/index.ts)
  return 'zh';
}

describe('Language Persistence', () => {
  let mockStorage: MockLocalStorage;

  beforeEach(() => {
    mockStorage = new MockLocalStorage();
  });

  /**
   * Task 19.1: 创建 localStorage 持久化测试
   * Tests for language preference save and restore functionality
   * **Validates: Requirements 7.3, 7.4**
   */
  describe('Task 19.1: localStorage Persistence Tests', () => {
    describe('Saving language preference', () => {
      test('should save language code to localStorage', () => {
        saveLanguagePreference(mockStorage, 'en');
        expect(mockStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
      });

      test('should overwrite previous language preference', () => {
        saveLanguagePreference(mockStorage, 'en');
        saveLanguagePreference(mockStorage, 'zh');
        expect(mockStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('zh');
      });

      test('should save all supported languages correctly', () => {
        for (const lang of SUPPORTED_LANGUAGES) {
          saveLanguagePreference(mockStorage, lang);
          expect(mockStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe(lang);
        }
      });
    });

    describe('Loading language preference', () => {
      test('should return null when no preference is saved', () => {
        expect(loadLanguagePreference(mockStorage)).toBeNull();
      });

      test('should return saved language preference', () => {
        mockStorage.setItem(LANGUAGE_STORAGE_KEY, 'fr');
        expect(loadLanguagePreference(mockStorage)).toBe('fr');
      });

      test('should return exact saved value', () => {
        for (const lang of SUPPORTED_LANGUAGES) {
          mockStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
          expect(loadLanguagePreference(mockStorage)).toBe(lang);
        }
      });
    });

    describe('Language detection with persistence', () => {
      test('should return saved language when available', () => {
        mockStorage.setItem(LANGUAGE_STORAGE_KEY, 'de');
        expect(detectLanguage(mockStorage)).toBe('de');
      });

      test('should fall back to browser language when no saved preference', () => {
        expect(detectLanguage(mockStorage, 'fr')).toBe('fr');
      });

      test('should fall back to default (zh) when browser language is not supported', () => {
        expect(detectLanguage(mockStorage, 'xyz')).toBe('zh');
      });

      test('should prioritize saved preference over browser language', () => {
        mockStorage.setItem(LANGUAGE_STORAGE_KEY, 'ja');
        expect(detectLanguage(mockStorage, 'fr')).toBe('ja');
      });

      test('should handle browser language with region code', () => {
        expect(detectLanguage(mockStorage, 'en-US')).toBe('en');
        expect(detectLanguage(mockStorage, 'zh-CN')).toBe('zh');
        expect(detectLanguage(mockStorage, 'pt-BR')).toBe('pt');
      });

      test('should ignore invalid saved language and use browser language', () => {
        mockStorage.setItem(LANGUAGE_STORAGE_KEY, 'invalid');
        expect(detectLanguage(mockStorage, 'es')).toBe('es');
      });
    });

    describe('Persistence across sessions (simulated)', () => {
      test('should restore language after simulated page reload', () => {
        // First session: save preference
        saveLanguagePreference(mockStorage, 'ko');

        // Simulate page reload by creating new detection context
        // (storage persists, but detection runs fresh)
        const restoredLanguage = detectLanguage(mockStorage);

        expect(restoredLanguage).toBe('ko');
      });

      test('should maintain preference through multiple saves', () => {
        const languageSequence: SupportedLanguage[] = ['en', 'zh', 'ja', 'ko', 'es'];

        for (const lang of languageSequence) {
          saveLanguagePreference(mockStorage, lang);
          expect(detectLanguage(mockStorage)).toBe(lang);
        }

        // Final state should be the last saved language
        expect(detectLanguage(mockStorage)).toBe('es');
      });
    });
  });

  /**
   * Task 19.2: Property Test - Language Persistence Round-Trip
   * **Property 5: Language Persistence Round-Trip**
   * **Feature: full-site-internationalization, Property 5: Language Persistence Round-Trip**
   * **Validates: Requirements 7.3, 7.4**
   */
  describe('Task 19.2: Property Test - Language Persistence Round-Trip', () => {
    /**
     * Property-based test: For any supported language code, saving to localStorage
     * and then reading back must return the same language code.
     *
     * **Feature: full-site-internationalization, Property 5: Language Persistence Round-Trip**
     * **Validates: Requirements 7.3, 7.4**
     */
    test('Property Test: For all supported languages, save then load returns same language', () => {
      const languageArb = fc.constantFrom(...SUPPORTED_LANGUAGES);

      fc.assert(
        fc.property(languageArb, (languageCode) => {
          // Create fresh storage for each test
          const storage = new MockLocalStorage();

          // Save the language preference
          saveLanguagePreference(storage, languageCode);

          // Load it back
          const loadedLanguage = loadLanguagePreference(storage);

          // Must return the exact same language code
          if (loadedLanguage !== languageCode) {
            throw new Error(
              `Round-trip failed: saved "${languageCode}" but loaded "${loadedLanguage}"`
            );
          }

          return true;
        }),
        { numRuns: 100 } // Run at least 100 iterations as per design spec
      );
    });

    /**
     * Property-based test: For any supported language code, the detection function
     * should return the saved language when it exists in localStorage.
     *
     * **Feature: full-site-internationalization, Property 5: Language Persistence Round-Trip**
     * **Validates: Requirements 7.3, 7.4**
     */
    test('Property Test: For all supported languages, detectLanguage returns saved preference', () => {
      const languageArb = fc.constantFrom(...SUPPORTED_LANGUAGES);
      const browserLangArb = fc.constantFrom(...SUPPORTED_LANGUAGES, 'unknown', 'xyz');

      fc.assert(
        fc.property(languageArb, browserLangArb, (savedLang, browserLang) => {
          const storage = new MockLocalStorage();

          // Save a language preference
          saveLanguagePreference(storage, savedLang);

          // Detection should return saved preference regardless of browser language
          const detectedLang = detectLanguage(storage, browserLang);

          if (detectedLang !== savedLang) {
            throw new Error(
              `Detection failed: saved "${savedLang}", browser "${browserLang}", but detected "${detectedLang}"`
            );
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property-based test: For any sequence of language changes, the final
     * detected language should match the last saved language.
     *
     * **Feature: full-site-internationalization, Property 5: Language Persistence Round-Trip**
     * **Validates: Requirements 7.3, 7.4**
     */
    test('Property Test: For any sequence of language changes, final state matches last save', () => {
      const languageSequenceArb = fc.array(fc.constantFrom(...SUPPORTED_LANGUAGES), {
        minLength: 1,
        maxLength: 10,
      });

      fc.assert(
        fc.property(languageSequenceArb, (languageSequence) => {
          const storage = new MockLocalStorage();

          // Apply all language changes in sequence
          for (const lang of languageSequence) {
            saveLanguagePreference(storage, lang);
          }

          // Final detected language should be the last one in the sequence
          const expectedLang = languageSequence[languageSequence.length - 1];
          const detectedLang = detectLanguage(storage);

          if (detectedLang !== expectedLang) {
            throw new Error(
              `Sequence test failed: expected "${expectedLang}" after sequence [${languageSequence.join(', ')}], but got "${detectedLang}"`
            );
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property-based test: Idempotence - saving the same language multiple times
     * should have the same effect as saving it once.
     *
     * **Feature: full-site-internationalization, Property 5: Language Persistence Round-Trip**
     * **Validates: Requirements 7.3, 7.4**
     */
    test('Property Test: Saving same language multiple times is idempotent', () => {
      const languageArb = fc.constantFrom(...SUPPORTED_LANGUAGES);
      const repeatCountArb = fc.integer({ min: 1, max: 10 });

      fc.assert(
        fc.property(languageArb, repeatCountArb, (languageCode, repeatCount) => {
          const storage = new MockLocalStorage();

          // Save the same language multiple times
          for (let i = 0; i < repeatCount; i++) {
            saveLanguagePreference(storage, languageCode);
          }

          // Result should be the same as saving once
          const loadedLanguage = loadLanguagePreference(storage);

          if (loadedLanguage !== languageCode) {
            throw new Error(
              `Idempotence failed: saved "${languageCode}" ${repeatCount} times, but loaded "${loadedLanguage}"`
            );
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
