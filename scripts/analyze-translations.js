/**
 * Translation Analysis Script
 * Scans all translation files and generates a missing translation report
 * 
 * Requirements: 1.1, 1.2
 */

const fs = require('fs');
const path = require('path');

// Supported languages
const LANGUAGES = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'ru', 'ar', 'pt', 'it', 'nl'];
const LOCALES_DIR = path.join(__dirname, '../src/i18n/locales');

/**
 * Recursively extract all translation keys from an object
 * @param {object} obj - The translation object
 * @param {string} prefix - Current key prefix
 * @returns {string[]} - Array of all translation keys
 */
function extractKeys(obj, prefix = '') {
  const keys = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...extractKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

/**
 * Get value from nested object by dot-notation key
 * @param {object} obj - The object to search
 * @param {string} key - Dot-notation key (e.g., 'nav.home')
 * @returns {any} - The value or undefined
 */
function getNestedValue(obj, key) {
  const parts = key.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[part];
  }
  
  return current;
}

/**
 * Load translation file and extract the translation object
 * @param {string} langCode - Language code (e.g., 'en')
 * @returns {object|null} - Translation object or null if failed
 */
function loadTranslation(langCode) {
  const filePath = path.join(LOCALES_DIR, `${langCode}.ts`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract the translation object from the TypeScript file
    // The file exports: export const xx = { translation: { ... } }
    const match = content.match(/export\s+const\s+\w+\s*=\s*(\{[\s\S]*\});?\s*$/);
    
    if (!match) {
      console.error(`Could not parse translation file: ${langCode}.ts`);
      return null;
    }
    
    // Use eval to parse the object (safe since we control the files)
    // eslint-disable-next-line no-eval
    const translationObj = eval(`(${match[1]})`);
    
    return translationObj.translation || translationObj;
  } catch (error) {
    console.error(`Error loading ${langCode}.ts:`, error.message);
    return null;
  }
}

/**
 * Analyze translations and generate report
 */
function analyzeTranslations() {
  console.log('='.repeat(80));
  console.log('Translation Analysis Report');
  console.log('='.repeat(80));
  console.log(`Generated: ${new Date().toISOString()}`);
  console.log('');
  
  // Load English as the reference
  const enTranslation = loadTranslation('en');
  if (!enTranslation) {
    console.error('Failed to load English translation file. Aborting.');
    process.exit(1);
  }
  
  // Extract all keys from English
  const enKeys = extractKeys(enTranslation);
  console.log(`Reference Language: English (en)`);
  console.log(`Total Translation Keys: ${enKeys.length}`);
  console.log('');
  
  // Store results for each language
  const results = {};
  const summary = [];
  
  // Analyze each language
  for (const lang of LANGUAGES) {
    if (lang === 'en') continue;
    
    const translation = loadTranslation(lang);
    if (!translation) {
      results[lang] = { error: 'Failed to load file', missing: [], extra: [] };
      summary.push({ lang, total: enKeys.length, missing: enKeys.length, extra: 0, coverage: '0%' });
      continue;
    }
    
    const langKeys = extractKeys(translation);
    const langKeySet = new Set(langKeys);
    const enKeySet = new Set(enKeys);
    
    // Find missing keys (in English but not in this language)
    const missingKeys = enKeys.filter(key => !langKeySet.has(key));
    
    // Find extra keys (in this language but not in English)
    const extraKeys = langKeys.filter(key => !enKeySet.has(key));
    
    // Find empty values
    const emptyKeys = langKeys.filter(key => {
      const value = getNestedValue(translation, key);
      return value === '' || value === null || value === undefined;
    });
    
    results[lang] = {
      total: langKeys.length,
      missing: missingKeys,
      extra: extraKeys,
      empty: emptyKeys
    };
    
    const coverage = ((enKeys.length - missingKeys.length) / enKeys.length * 100).toFixed(1);
    summary.push({
      lang,
      total: langKeys.length,
      missing: missingKeys.length,
      extra: extraKeys.length,
      empty: emptyKeys.length,
      coverage: `${coverage}%`
    });
  }
  
  // Print summary table
  console.log('Summary by Language:');
  console.log('-'.repeat(80));
  console.log('| Language | Total Keys | Missing | Extra | Empty | Coverage |');
  console.log('|----------|------------|---------|-------|-------|----------|');
  
  for (const s of summary) {
    const langName = getLanguageName(s.lang);
    console.log(`| ${langName.padEnd(8)} | ${String(s.total).padStart(10)} | ${String(s.missing).padStart(7)} | ${String(s.extra).padStart(5)} | ${String(s.empty || 0).padStart(5)} | ${s.coverage.padStart(8)} |`);
  }
  console.log('-'.repeat(80));
  console.log('');
  
  // Print detailed missing keys for each language
  console.log('Detailed Missing Keys by Language:');
  console.log('='.repeat(80));
  
  for (const lang of LANGUAGES) {
    if (lang === 'en') continue;
    
    const result = results[lang];
    if (!result || result.error) {
      console.log(`\n[${lang.toUpperCase()}] ${getLanguageName(lang)}: ERROR - ${result?.error || 'Unknown error'}`);
      continue;
    }
    
    console.log(`\n[${lang.toUpperCase()}] ${getLanguageName(lang)}:`);
    console.log(`  Missing: ${result.missing.length} keys`);
    
    if (result.missing.length > 0) {
      // Group missing keys by top-level section
      const grouped = groupKeysBySection(result.missing);
      
      for (const [section, keys] of Object.entries(grouped)) {
        console.log(`  - ${section}: ${keys.length} keys`);
        // Show first 5 keys as examples
        const examples = keys.slice(0, 5);
        for (const key of examples) {
          console.log(`      • ${key}`);
        }
        if (keys.length > 5) {
          console.log(`      ... and ${keys.length - 5} more`);
        }
      }
    }
    
    if (result.extra.length > 0) {
      console.log(`  Extra keys (not in English): ${result.extra.length}`);
    }
  }
  
  // Generate JSON report
  const report = {
    generated: new Date().toISOString(),
    referenceLanguage: 'en',
    totalKeys: enKeys.length,
    allKeys: enKeys,
    languages: results,
    summary: summary
  };
  
  const reportPath = path.join(__dirname, '../translation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nDetailed report saved to: ${reportPath}`);
  
  return report;
}

/**
 * Group keys by their top-level section
 */
function groupKeysBySection(keys) {
  const grouped = {};
  
  for (const key of keys) {
    const section = key.split('.')[0];
    if (!grouped[section]) {
      grouped[section] = [];
    }
    grouped[section].push(key);
  }
  
  return grouped;
}

/**
 * Get human-readable language name
 */
function getLanguageName(code) {
  const names = {
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
  return names[code] || code;
}

// Run the analysis
analyzeTranslations();
