import { translate } from '../../src/utils/helpers';
import { Translations } from '../../src/types';

describe('translate', () => {
  it('should return user translation when provided', () => {
    const userTranslations: Translations = {
      results: 'resultats',
      for: 'pour',
      Filters: 'Filtres',
      'Sort by:': 'Trier par:',
      Categories: 'Categories',
      'Show All': 'Afficher tout',
      'Show Less': 'Afficher moins',
    };

    expect(translate('results', userTranslations)).toBe('resultats');
    expect(translate('for', userTranslations)).toBe('pour');
    expect(translate('Filters', userTranslations)).toBe('Filtres');
    expect(translate('Sort by:', userTranslations)).toBe('Trier par:');
    expect(translate('Categories', userTranslations)).toBe('Categories');
    expect(translate('Show All', userTranslations)).toBe('Afficher tout');
    expect(translate('Show Less', userTranslations)).toBe('Afficher moins');
  });

  it('should return default English translation when user translation not provided', () => {
    expect(translate('results')).toBe('results');
    expect(translate('for')).toBe('for');
    expect(translate('Filters')).toBe('Filters');
    expect(translate('Sort by:')).toBe('Sort by:');
    expect(translate('By')).toBe('By');
    expect(translate('Sort')).toBe('Sort');
    expect(translate('Categories')).toBe('Categories');
    expect(translate('Show All')).toBe('Show All');
    expect(translate('Show Less')).toBe('Show Less');
  });

  it('should return default English when partial translations provided', () => {
    const partialTranslations: Translations = {
      results: 'resultats',
      // other keys not provided
    };

    expect(translate('results', partialTranslations)).toBe('resultats');
    expect(translate('for', partialTranslations)).toBe('for'); // should fallback to default
    expect(translate('Filters', partialTranslations)).toBe('Filters'); // should fallback to default
  });

  it('should return original word if no translation exists', () => {
    expect(translate('non-existent-key')).toBe('non-existent-key');
  });

  it('should handle zero results translations', () => {
    const userTranslations: Translations = {
      "Sorry, we didn't find:": 'Desole, nous n\'avons pas trouve:',
      'Sorry, we were unable to find what you were looking for.':
        'Desole, nous n\'avons pas pu trouver ce que vous cherchiez.',
      'Check for typos': 'Verifier les fautes de frappe',
      'Use fewer keywords': 'Utiliser moins de mots-cles',
      'Broaden your search terms': 'Elargir vos termes de recherche',
    };

    expect(translate("Sorry, we didn't find:", userTranslations)).toBe(
      'Desole, nous n\'avons pas trouve:',
    );
    expect(
      translate('Sorry, we were unable to find what you were looking for.', userTranslations),
    ).toBe('Desole, nous n\'avons pas pu trouver ce que vous cherchiez.');
    expect(translate('Check for typos', userTranslations)).toBe('Verifier les fautes de frappe');
    expect(translate('Use fewer keywords', userTranslations)).toBe('Utiliser moins de mots-cles');
    expect(translate('Broaden your search terms', userTranslations)).toBe(
      'Elargir vos termes de recherche',
    );
  });

  it('should handle empty translations object', () => {
    const emptyTranslations: Translations = {};

    expect(translate('results', emptyTranslations)).toBe('results');
    expect(translate('Filters', emptyTranslations)).toBe('Filters');
  });

  it('should handle undefined translations parameter', () => {
    expect(translate('results', undefined)).toBe('results');
    expect(translate('Filters', undefined)).toBe('Filters');
  });

  it('should handle translation with value explicitly set to undefined', () => {
    const translationsWithUndefined: Translations = {
      results: undefined,
    };

    // When undefined is explicitly set, it should fallback to default
    expect(translate('results', translationsWithUndefined)).toBe('results');
  });
});
