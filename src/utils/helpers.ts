import { Translations } from '../types';

/**
 * Translates a word using the provided translations object.
 * Falls back to English defaults if translation is not provided.
 *
 * @param word - The key to translate
 * @param translations - Optional user-provided translations object
 * @returns The translated string or the original word if no translation exists
 */
// eslint-disable-next-line import/prefer-default-export
export const translate = (word: string, translations?: Translations): string => {
  // Define default English translations
  const localTranslations: Translations = {
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

    // Zero Results
    "Sorry, we didn't find:": "Sorry, we didn't find:",
    'Sorry, we were unable to find what you were looking for.':
      'Sorry, we were unable to find what you were looking for.',
    'Check for typos': 'Check for typos',
    'Use fewer keywords': 'Use fewer keywords',
    'Broaden your search terms': 'Broaden your search terms',
  };

  // If user provided translations, use them
  if (translations && translations[word as keyof Translations] !== undefined) {
    return translations[word as keyof Translations] as string;
  }

  // Otherwise fallback to default or return the word itself
  return (localTranslations[word as keyof Translations] as string) || word;
};
