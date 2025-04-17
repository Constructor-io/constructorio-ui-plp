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
