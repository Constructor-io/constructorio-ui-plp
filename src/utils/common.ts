// Function to emulate pausing between interactions
export function sleep(ms) {
  // eslint-disable-next-line
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* istanbul ignore next */
export const logger = (error: any) => {
  try {
    if (typeof process !== 'undefined' && process?.env?.LOGGER) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  } catch (e) {
    // process variable is not available and logger should not be active
  }
};

// eslint-disable-next-line @cspell/spellchecker
export function tryCatchify(func: Function) {
  return (...args: any) => {
    try {
      return func(...args);
    } catch (e) {
      logger(e);
    }
    return undefined;
  };
}

export function removeNullValuesFromObject(obj: Object) {
  const filteredListOfEntries = Object.entries(obj).filter(([, val]) => val != null);

  return Object.fromEntries(filteredListOfEntries);
}

export function isValidSalePrice(salePrice?: number, usualPrice?: number) {
  return salePrice != null && usualPrice != null && salePrice >= 0 && salePrice < usualPrice;
}

/**
 * Turns a facet name or option value into a token that is safe to use inside a DOM `id`.
 *
 * Option values routinely carry whitespace, quotes and slashes (`"4"-"inf"`, `Black / Navy`), which
 * make an `id` invalid and silently break `aria-controls` — that attribute is a space-delimited
 * token list, so an `id` containing a space resolves to nothing.
 *
 * Letters and digits of any script are kept, so ids stay readable (and stable) for non-Latin
 * catalogs. Returns an empty string when a value has nothing else left (e.g. `"+"`), leaving it to
 * the caller to fall back to a positional token.
 */
export function slugify(value: string) {
  return String(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}
