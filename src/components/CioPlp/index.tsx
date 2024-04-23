import React from 'react';
import { CioPlpProps, IncludeRenderProps, PlpContextValue } from '../../types';
import CioPlpProvider from './CioPlpProvider';

// Wrapper component for CioPlpProvider with default Markup
export default function CioPlp(props: IncludeRenderProps<CioPlpProps, PlpContextValue>) {
  const { children } = props;
  // Todo: Add SearchResults/BrowseResults
  const defaultMarkup = <div>To Do: Return actual default markup</div>;

  return (
    <div className='cio-plp-global'>
      <CioPlpProvider {...props}>{children || defaultMarkup}</CioPlpProvider>
    </div>
  );
}
