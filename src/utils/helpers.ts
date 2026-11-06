import { Translations } from '../types';

const DEFAULT_TRANSLATIONS: Translations = {
  // Result display
  results: 'results',
  for: 'for',

  // Filters
  Filters: 'Filters',

  // Sort
  'Sort by:': 'Sort by:',
  By: 'By',
  Sort: 'Sort',

  // Groups/Categories
  Categories: 'Categories',
  'Show All': 'Show All',
  'Show Less': 'Show Less',

  // Range Filter
  from: 'from',
  to: 'to',

  // Product Card
  'Add to Cart': 'Add to Cart',

  // Screen reader announcements (live region). `{count}` is replaced with the number of results
  'Loading results': 'Loading results',
  'No results found': 'No results found',
  '1 result found': '1 result found',
  '{count} results found': '{count} results found',

  // Zero Results
  "Sorry, we didn't find:": "Sorry, we didn't find:",
  'Sorry, we were unable to find what you were looking for.':
    'Sorry, we were unable to find what you were looking for.',
  'Check for typos': 'Check for typos',
  'Use fewer keywords': 'Use fewer keywords',
  'Broaden your search terms': 'Broaden your search terms',
};

/**
 * Translates a word using the provided translations object.
 * Falls back to English defaults if translation is not provided.
 *
 * @param word - The key to translate
 * @param translations - Optional user-provided translations object
 * @returns The translated string or the original word if no translation exists
 */
export const translate = (word: keyof Translations, translations?: Translations): string => {
  if (translations && translations[word] !== undefined) {
    return translations[word] as string;
  }
  if (DEFAULT_TRANSLATIONS[word] !== undefined) {
    return DEFAULT_TRANSLATIONS[word] as string;
  }
  return word;
};

/**
 * Translates a word and replaces `{param}` placeholders with the provided values.
 * Placeholders without a matching param are left untouched.
 *
 * @param word - The key to translate
 * @param params - Values to interpolate into the translated string
 * @param translations - Optional user-provided translations object
 * @returns The translated string with placeholders replaced
 */
export const translateWithParams = (
  word: keyof Translations,
  params: Record<string, string | number>,
  translations?: Translations,
): string =>
  translate(word, translations).replace(/\{(\w+)\}/g, (placeholder, name) =>
    params[name] !== undefined ? String(params[name]) : placeholder,
  );
