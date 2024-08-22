import React, { useState } from 'react';
import { UsePaginationProps } from '../../../types';
import Pagination from '../../../components/Pagination/Pagination';
import CioPlp from '../../../components/CioPlp/CioPlp';
import { DEMO_API_KEY } from '../../../constants';

export default function UsePaginationExample(props: UsePaginationProps) {
  const [currentUrl, setCurrentUrl] = useState(window.location.href);

  return (
    <CioPlp
      apiKey={DEMO_API_KEY}
      urlHelpers={{
        setUrl: (url) => {
          setCurrentUrl(url);
        },
        getUrl: () => currentUrl,
      }}>
      <Pagination {...props} />
    </CioPlp>
  );
}
