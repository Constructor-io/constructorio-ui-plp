import { createContext, useContext } from 'react';
import { PlpContextType } from '../types';

export const PlpContext = createContext<PlpContextType | null>(null);
PlpContext.displayName = 'PlpContext';

/**
 * React Hook to access state provided by CioPlpContext.
 * Note: Should only be used by components nested under a CioPlpContext
 */
export function useCioPlpContext() {
  return useContext(PlpContext as React.Context<PlpContextType>);
}
