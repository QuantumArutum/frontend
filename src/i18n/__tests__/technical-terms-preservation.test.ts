/**
 * Technical Terms Preservation Tests
 * 
 * Property 6: Technical Terms Preservation
 * For all translations across all locales, technical terms that should not be 
 * translated (QAU, NIST, TPS, EVM, API, SDK, JSON-RPC, etc.) must appear 
 * unchanged in the translated text.
 * 
 * **Validates: Requirements 12.3**
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
 * Technical terms that should NOT be translated and must appear unchanged
 * in all locale files. These are industry-standard acronyms and proper nouns.
 */
const TECHNICAL_TERMS = [
  'QAU',           // Quantaureum token symbol
  'NIST',          // National Institute of Standards and Technology
  'TPS',           // Transactions Per Second
  'EVM',           // Ethereum Virtual Machine
  'API',           // Application Programming Interface
  'SDK',           // Software Development Kit
  'JSON-RPC',      // JSON Remote Procedure Call
  'CRYSTALS-Dilithium', // Post-quantum signature algorithm
  'CRYSTALS-Kyber',     // Post-quantum key encapsulation
  'Dilithium',     // Signature algorithm name
  'Kyber',         // Key encapsulation name
  'QVM',           // Quantaureum Virtual Machine
  'ETH',           // Ethereum symbol
  'BTC',           // Bitcoin symbol
  'MATIC',         // Polygon symbol
  'USDT',          // Tether symbol
  'REST',          // Representational State Transfer
  'WebSocket',     // WebSocket protocol
  'DApp',          // Decentralized Application
  'Web3',          // Web3 technology
  'Ledger',        // Hardware wallet brand
  'Trezor',        // Hardware wallet brand
  'MetaMask',      // Wallet brand
  'Solidity',      // Smart contract language
  'APY',           // Annual Percentage Yield
  'TVL',           // Total Value Locked
  'RPC',           // Remote Procedure Call
  'QRNG',          // Quantum Random Number Generator
] as const;

type TechnicalTerm = typeof TECHNICAL_TERMS[number];

/**
 * Recursively extracts all string values from a nested object
 * Returns an array of objects with key path and value
 */
function getAllTranslationValues(
  obj: unknown, 
  prefix = ''
): Array<{ key: string; value: string }> {
  const results: Array<{ key: string; value: string }> = [];
  
  if (obj === null || obj === undefined) {
    return results;
  }
  
  if (typeof obj !== 'object') {
    return results;
  }
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'string') {
      results.push({ key: fullKey, value });
    } else if (typeof value === 'object' && value !== null) {
      results.push(...getAllTranslationValues(value, fullKey));
    }
  }
  
  return results;
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

/**
 * Checks if a string contains a technical term (case-sensitive)
 */
function containsTechnicalTerm(text: string, term: TechnicalTerm): boolean {
  return text.includes(term);
}

/**
 * Finds all translation keys in English that contain a specific technical term
 */
function findKeysWithTerm(term: TechnicalTerm): string[] {
  const allValues = getAllTranslationValues(en.translation);
  return allValues
    .filter(({ value }) => containsTechnicalTerm(value, term))
    .map(({ key }) => key);
}

describe('Technical Terms Preservation', () => {
  /**
   * Task 20.1: Property Test - Technical Terms Preservation
   * **Property 6: Technical Terms Preservation**
   * **Feature: full-site-internationalization, Property 6: Technical Terms Preservation**
   * **Validates: Requirements 12.3**
   */
  describe('Task 20.1: Property Test - Technical Terms Preservation', () => {
    
    /**
     * Property-based test: For any technical term that appears in the English locale,
     * the same term must appear unchanged in all other locale translations.
     * 
     * **Feature: full-site-internationalization, Property 6: Technical Terms Preservation**
     * **Validates: Requirements 12.3**
     */
    test('Property Test: For all technical terms in English, the term appears unchanged in all other locales', () => {
      // Build a map of terms to their keys
      const termToKeys = new Map<TechnicalTerm, string[]>();
      
      for (const term of TECHNICAL_TERMS) {
        const keys = findKeysWithTerm(term);
        if (keys.length > 0) {
          termToKeys.set(term, keys);
        }
      }
      
      // Get terms that actually appear in English translations
      const termsInUse = Array.from(termToKeys.keys());
      
      if (termsInUse.length === 0) {
        // No technical terms found in English - skip test
        return;
      }
      
      // Create arbitraries
      const termArb = fc.constantFrom(...termsInUse);
      const nonEnglishLocales = Object.keys(locales).filter(
        (code) => code !== 'en'
      ) as LocaleCode[];
      const localeArb = fc.constantFrom(...nonEnglishLocales);
      
      fc.assert(
        fc.property(termArb, localeArb, (term, localeCode) => {
          const keysWithTerm = termToKeys.get(term) || [];
          const locale = locales[localeCode];
          
          for (const key of keysWithTerm) {
            const englishValue = getNestedValue(en.translation, key) as string;
            const localizedValue = getNestedValue(locale.translation, key) as string;
            
            // Skip if the key doesn't exist in the target locale
            if (localizedValue === undefined) {
              continue;
            }
            
            // If English contains the term, the localized version must also contain it
            if (containsTechnicalTerm(englishValue, term)) {
              if (!containsTechnicalTerm(localizedValue, term)) {
                throw new Error(
                  `Technical term "${term}" is missing in ${localeNames[localeCode]} (${localeCode}) ` +
                  `for key "${key}". English: "${englishValue}", Localized: "${localizedValue}"`
                );
              }
            }
          }
          
          return true;
        }),
        { numRuns: 100 } // Run at least 100 iterations as per design spec
      );
    });

    /**
     * Deterministic test: Verify each technical term is preserved in all locales
     * for all keys where it appears in English.
     */
    test('All technical terms are preserved across all locales', () => {
      const nonEnglishLocales = Object.keys(locales).filter(
        (code) => code !== 'en'
      ) as LocaleCode[];
      
      const violations: string[] = [];
      
      for (const term of TECHNICAL_TERMS) {
        const keysWithTerm = findKeysWithTerm(term);
        
        for (const key of keysWithTerm) {
          const englishValue = getNestedValue(en.translation, key) as string;
          
          for (const localeCode of nonEnglishLocales) {
            const locale = locales[localeCode];
            const localizedValue = getNestedValue(locale.translation, key) as string;
            
            // Skip if key doesn't exist in target locale
            if (localizedValue === undefined) {
              continue;
            }
            
            // Check if term is preserved
            if (!containsTechnicalTerm(localizedValue, term)) {
              violations.push(
                `"${term}" missing in ${localeCode} for key "${key}": "${localizedValue.substring(0, 50)}..."`
              );
            }
          }
        }
      }
      
      // Report all violations at once for better debugging
      if (violations.length > 0) {
        throw new Error(
          `Technical terms not preserved:\n${violations.slice(0, 10).join('\n')}` +
          (violations.length > 10 ? `\n... and ${violations.length - 10} more` : '')
        );
      }
    });
  });

  describe('Technical term presence verification', () => {
    test('English locale contains expected technical terms', () => {
      const allValues = getAllTranslationValues(en.translation);
      const allText = allValues.map(v => v.value).join(' ');
      
      // Verify key technical terms are present in English
      const expectedTerms: TechnicalTerm[] = ['QAU', 'NIST', 'TPS', 'EVM', 'API', 'SDK'];
      
      for (const term of expectedTerms) {
        expect(allText).toContain(term);
      }
    });

    test('Technical terms list is not empty', () => {
      expect(TECHNICAL_TERMS.length).toBeGreaterThan(0);
    });

    test('At least some technical terms appear in English translations', () => {
      let foundTerms = 0;
      
      for (const term of TECHNICAL_TERMS) {
        const keys = findKeysWithTerm(term);
        if (keys.length > 0) {
          foundTerms++;
        }
      }
      
      expect(foundTerms).toBeGreaterThan(0);
    });
  });

  describe('Individual term preservation checks', () => {
    // Test specific high-priority terms individually
    const criticalTerms: TechnicalTerm[] = ['QAU', 'NIST', 'TPS', 'EVM'];
    
    for (const term of criticalTerms) {
      test(`"${term}" is preserved in all locales where it appears`, () => {
        const keysWithTerm = findKeysWithTerm(term);
        
        if (keysWithTerm.length === 0) {
          // Term not used in English - skip
          return;
        }
        
        const nonEnglishLocales = Object.keys(locales).filter(
          (code) => code !== 'en'
        ) as LocaleCode[];
        
        for (const key of keysWithTerm) {
          for (const localeCode of nonEnglishLocales) {
            const locale = locales[localeCode];
            const localizedValue = getNestedValue(locale.translation, key) as string;
            
            if (localizedValue !== undefined) {
              expect(localizedValue).toContain(term);
            }
          }
        }
      });
    }
  });
});
