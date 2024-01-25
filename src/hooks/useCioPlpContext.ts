import { createContext, useContext } from 'react';
import { PlpContextValue } from '../types';

export const PlpContext = createContext<PlpContextValue | null>(null);
PlpContext.displayName = 'PlpContext';

/**
 * React Hook to access state provided by CioPlp provider.
 * Note: Should only be used by components nested under a CioPlp provider
 */
export function useCioPlpContext() {
  return useContext(PlpContext as React.Context<PlpContextValue>);
}
