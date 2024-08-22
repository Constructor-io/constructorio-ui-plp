import React from 'react';
import { CioPlpProps, IncludeRenderProps, PlpContextValue } from '../../types';
import CioPlpProvider from './CioPlpProvider';
import CioPlpGrid from '../CioPlpGrid';

// Wrapper component for CioPlpProvider with default Markup
export default function CioPlp(props: IncludeRenderProps<CioPlpProps, PlpContextValue>) {
  const { children, initialResponse, ...rest } = props;
  const defaultMarkup = <CioPlpGrid initialResponse={initialResponse} />;

  return (
    <div className='cio-plp'>
      <CioPlpProvider {...rest}>{children || defaultMarkup}</CioPlpProvider>
    </div>
  );
}
