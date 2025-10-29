export const DEMO_API_KEY = 'key_M57QS8SMPdLdLx4x';

export const EMITTED_EVENTS = {
  PRODUCT_CARD_IMAGE_ROLLOVER: 'cio.ui-plp.productCardImageRollover',
};

/**
 * Documentation for the translations feature.
 * Pass a `translations` object to the CioPlpProvider to display translatable words in your preferred language.
 *
 * All translation keys are optional - any non-provided translation will fallback to English default.
 *
 * IMPORTANT: Translations only apply to hardcoded UI strings within the library.
 * They do NOT translate dynamic content from the API response, such as:
 * - Sort option labels (e.g., "Relevance", "Price: Low to High")
 * - Facet names and values (e.g., "Color", "Size", "Brand")
 * - Product names, descriptions, and other catalog data
 *
 * API response content should be translated on your backend or through Constructor.io's dashboard configuration.
 *
 * Current translatable keys:
 * ```
 * {
 *   // Result display
 *   "results": "results",
 *   "for": "for",
 *
 *   // Filters
 *   "Filters": "Filters",
 *
 *   // Sort
 *   "Sort by:": "Sort by:",
 *   "By": "By",
 *   "Sort": "Sort",
 *
 *   // Groups/Categories
 *   "Categories": "Categories",
 *   "Show All": "Show All",
 *   "Show Less": "Show Less",
 *
 *   // Zero Results
 *   "Sorry, we didn't find:": "Sorry, we didn't find:",
 *   "Sorry, we were unable to find what you were looking for.": "Sorry, we were unable to find what you were looking for.",
 *   "Check for typos": "Check for typos",
 *   "Use fewer keywords": "Use fewer keywords",
 *   "Broaden your search terms": "Broaden your search terms"
 * }
 * ```
 *
 * @example
 * // French translations
 * <CioPlpProvider
 *   apiKey="your-api-key"
 *   translations={{
 *     results: "résultats",
 *     for: "pour",
 *     Filters: "Filtres",
 *     "Sort by:": "Trier par:",
 *     Categories: "Catégories",
 *     "Show All": "Afficher tout",
 *     "Show Less": "Afficher moins"
 *   }}
 * >
 *   <CioPlpGrid />
 * </CioPlpProvider>
 */
export const translationsDescription = `Pass a \`translations\` object to display translatable words in your preferred language.

All translation keys are optional - any non-provided translation will fallback to English default.

- Current translatable keys:
\`\`\`
{
  // Result display
  "results": "...",
  "for": "...",

  // Filters
  "Filters": "...",

  // Sort
  "Sort by:": "...",
  "By": "...",
  "Sort": "...",

  // Groups/Categories
  "Categories": "...",
  "Show All": "...",
  "Show Less": "...",

  // Zero Results
  "Sorry, we didn't find:": "...",
  "Sorry, we were unable to find what you were looking for.": "...",
  "Check for typos": "...",
  "Use fewer keywords": "...",
  "Broaden your search terms": "..."
}
\`\`\`
`;
