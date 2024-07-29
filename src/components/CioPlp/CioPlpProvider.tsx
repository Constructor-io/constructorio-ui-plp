import React from 'react';
import { PlpContextValue, IncludeRenderProps, CioPlpProviderProps } from '../../types';
import { PlpContext } from '../../hooks/useCioPlpContext';
import useCioPlpProvider from '../../hooks/useCioPlpProvider';

export default function CioPlpProvider(
  props: IncludeRenderProps<CioPlpProviderProps, PlpContextValue>,
) {
  const { children, ...rest } = props;
  const contextValue = useCioPlpProvider(rest);

  return (
    <PlpContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </PlpContext.Provider>
  );
}
