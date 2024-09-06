import React from 'react';
import { IncludeRenderProps, PlpContextValue, CioPlpProviderProps } from '../../types';
import CioPlpProvider from './CioPlpProvider';
import CioPlpGrid from '../CioPlpGrid';
import { UseCioPlpProps } from '../../hooks/useCioPlp';

export type CioPlpProps = CioPlpProviderProps & UseCioPlpProps;

// Wrapper component for CioPlpProvider with default Markup
export default function CioPlp(props: IncludeRenderProps<CioPlpProps, PlpContextValue>) {
  const { children, initialResponse, sortConfigs, paginationConfigs, filterConfigs, ...rest } =
    props;
  const defaultMarkup = (
    <CioPlpGrid
      initialResponse={initialResponse}
      sortConfigs={sortConfigs}
      paginationConfigs={paginationConfigs}
      filterConfigs={filterConfigs}
    />
  );

  return (
    <div className='cio-plp'>
      <CioPlpProvider {...rest}>{children || defaultMarkup}</CioPlpProvider>
    </div>
  );
}
