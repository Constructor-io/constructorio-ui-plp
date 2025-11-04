import React from 'react';
import { IncludeRenderProps, PlpContextValue, CioPlpProviderProps } from '../../types';
import CioPlpProvider from './CioPlpProvider';
import { UseCioPlpProps } from '../../hooks/useCioPlp';
import CioPlpGrid from '../CioPlpGrid';

export type CioPlpProps = CioPlpProviderProps & UseCioPlpProps;

// Wrapper component for CioPlpProvider with default Markup
export default function CioPlp(props: IncludeRenderProps<CioPlpProps, PlpContextValue>) {
  const {
    children,
    initialSearchResponse,
    initialBrowseResponse,
    sortConfigs,
    paginationConfigs,
    filterConfigs,
    groupsConfigs,
    ...rest
  } = props;
  const defaultMarkup = (
    <CioPlpGrid
      initialSearchResponse={initialSearchResponse}
      initialBrowseResponse={initialBrowseResponse}
      sortConfigs={sortConfigs}
      paginationConfigs={paginationConfigs}
      filterConfigs={filterConfigs}
      groupsConfigs={groupsConfigs}
    />
  );

  return (
    <div className='cio-plp'>
      <CioPlpProvider {...rest}>{children || defaultMarkup}</CioPlpProvider>
    </div>
  );
}
