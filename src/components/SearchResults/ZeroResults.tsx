import React from 'react';
import useRequestConfigs from '../../hooks/useRequestConfigs';
import './ZeroResults.css';

/**
 * Renders the 'no results' component if search results returns no items.
 *
 * @component
 * @returns {JSX.Element} The 'no results' component
 */
export default function ZeroResults() {
  const config = useRequestConfigs();
  const { query } = config.requestConfigs;

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
