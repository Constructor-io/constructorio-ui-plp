import React from 'react';
import { SearchResponse } from '@constructor-io/constructorio-client-javascript/lib/types';
import { IncludeRenderProps } from '../../types';
import ProductCard from '../ProductCard/ProductCard';
import Filters from '../Filters';
import Sort from '../Sort/Sort';
import Pagination from '../Pagination';
import useSearchResults, { UseSearchResultsReturn } from '../../hooks/useSearchResults';
import ZeroResults from './ZeroResults/ZeroResults';
import Spinner from '../Spinner/Spinner';
import { RequestStatus } from './reducer';
import { isPlpSearchDataRedirect } from '../../utils';

export type CioPlpGridProps = {
  initialResponse?: SearchResponse;
  spinner?: React.ReactNode;
};
export type CioPlpGridWithRenderProps = IncludeRenderProps<CioPlpGridProps, UseSearchResultsReturn>;

export default function CioPlpGrid(props: CioPlpGridWithRenderProps) {
  const { spinner, initialResponse, children } = props;

  const { data, status, refetch } = useSearchResults({ initialSearchResponse: initialResponse });
  if (isPlpSearchDataRedirect(data)) {
    // Do redirect
    return null;
  }

  const response = data?.response;

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
                    <Filters facets={response.facets} />
                  </div>
                  <div className='cio-products-container'>
                    <div className='cio-products-header-container'>
                      <span>
                        <b>{response?.totalNumResults}</b> results
                      </span>
                      <Sort sortOptions={response.sortOptions} isOpen={false} />
                    </div>
                    <div className='cio-product-tiles-container'>
                      {response?.results?.map((item) => (
                        <div className='cio-product-tile'>
                          <ProductCard key={item.itemId} item={item} />
                        </div>
                      ))}
                    </div>
                    <div className='cio-pagination-container'>
                      <Pagination
                        totalNumResults={response.totalNumResults}
                        resultsPerPage={response.numResultsPerPage}
                      />
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
