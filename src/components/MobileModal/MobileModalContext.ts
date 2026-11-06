import { createContext, useContext } from 'react';

/**
 * Suffix for ids rendered inside a `MobileModal`. This allows for nested components that are duplicated
 * to have unique html ids.
 */
export const MOBILE_MODAL_ID_SUFFIX = '-mobile';

const MobileModalContext = createContext(false);

/**
 * @returns The suffix to append to ids rendered within a `MobileModal`, or an empty string.
 */
export const useMobileModalIdSuffix = () =>
  useContext(MobileModalContext) ? MOBILE_MODAL_ID_SUFFIX : '';

export default MobileModalContext;
