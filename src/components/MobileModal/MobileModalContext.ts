import { createContext, useContext } from 'react';

/**
 * Suffix for ids rendered inside a `MobileModal`. Filters and Groups are rendered twice —
 * in the desktop sidebar and in the mobile modal — so without it both copies share the same
 * ids, and every `<label for>` in the modal resolves to the hidden desktop input, leaving the
 * modal's checkboxes without an accessible name. (WCAG 4.1.2)
 */
export const MOBILE_MODAL_ID_SUFFIX = '-mobile';

const MobileModalContext = createContext(false);

/**
 * @returns The suffix to append to ids rendered within a `MobileModal`, or an empty string.
 */
export const useMobileModalIdSuffix = () =>
  useContext(MobileModalContext) ? MOBILE_MODAL_ID_SUFFIX : '';

export default MobileModalContext;
