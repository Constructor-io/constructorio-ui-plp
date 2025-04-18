import React from 'react';
import useRequestConfigs from '../../../hooks/useRequestConfigs';

/**
 * Renders the 'no results' component if search results returns no items.
 *
 * @component
 * @returns {JSX.Element} The 'no results' component
 */
export default function ZeroResults() {
  const { getRequestConfigs } = useRequestConfigs();
  const { query } = getRequestConfigs();

  if (query) {
    return (
      <>
        <div className='cio-zero-results-header'>Sorry, we didn’t find: “{query}”</div>
        <ul className='cio-zero-results-option-list'>
          <li>Check for typos</li>
          <li>Use fewer keywords</li>
          <li>Broaden your search terms</li>
        </ul>
      </>
    );
  }

  return (
    <>
      <div className='cio-zero-results-header'>
        Sorry, we were unable to find what you were looking for.
      </div>
      <ul className='cio-zero-results-option-list'>
        <li>Check for typos</li>
        <li>Use fewer keywords</li>
        <li>Broaden your search terms</li>
      </ul>
      <ul className='cio-zero-results-option-list'>
        <li>
          To visit <strong>Search Page</strong> example, append current URL with <i>?q=shirt</i>
        </li>
        <li>
          To visit <strong>Browse Page</strong> example, append current URL with{' '}
          <i>/group_id/1035</i>
        </li>
      </ul>
    </>
  );
}
