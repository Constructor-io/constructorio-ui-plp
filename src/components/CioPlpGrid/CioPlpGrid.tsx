import React from 'react';
import { IncludeRenderProps, PlpSearchRedirectResponse, PlpSearchResponse } from '../../types';
import ProductCard from '../ProductCard';
import Filters from '../Filters';
import Sort from '../Sort/Sort';
import Pagination from '../Pagination';
import useSearchResults, { UseSearchResultsReturn } from '../../hooks/useSearchResults';
import ZeroResults from './ZeroResults/ZeroResults';
import Spinner from '../Spinner/Spinner';
import { RequestStatus } from './reducer';

type CioPlpGridProps = {
  initialResponse?: PlpSearchResponse | PlpSearchRedirectResponse;
  spinner?: React.ReactNode;
};
type CioPlpGridWithRenderProps = IncludeRenderProps<CioPlpGridProps, UseSearchResultsReturn>;

export default function CioPlpGrid(props: CioPlpGridWithRenderProps) {
  const { spinner, initialResponse, children } = props;

  const { data, status, refetch } = useSearchResults({ initialSearchResponse: initialResponse });
  const response = data?.response as unknown as PlpSearchResponse;

  return (
    <>
      {typeof children === 'function' ? (
        children({
          data,
          status,
          refetch,
        })
      ) : (
        <>
          {status === RequestStatus.FETCHING && (spinner || <Spinner />)}
          {status !== RequestStatus.FETCHING && status !== RequestStatus.STALE && (
            <>
              {response?.results?.length ? (
                <div className='cio-plp-grid'>
                  <div className='cio-filters-container'>
                    <Filters response={response} />
                  </div>
                  <div className='cio-products-container'>
                    <div className='cio-products-header-container'>
                      <span>
                        <b>{response?.totalNumResults}</b> results
                      </span>
                      <Sort searchOrBrowseResponse={response} isOpen={false} />
                    </div>
                    <div className='cio-product-tiles-container'>
                      {response?.results?.map((item) => (
                        <div className='cio-product-tile'>
                          <ProductCard key={item.itemId} item={item} />
                        </div>
                      ))}
                    </div>
                    <div className='cio-pagination-container'>
                      <Pagination totalNumResults={response?.totalNumResults} />
                    </div>
                  </div>
                </div>
              ) : (
                <ZeroResults />
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
