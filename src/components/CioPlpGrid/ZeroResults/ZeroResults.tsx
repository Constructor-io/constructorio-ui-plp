import React from 'react';
import useRequestConfigs from '../../../hooks/useRequestConfigs';
import { useCioPlpContext } from '../../../hooks/useCioPlpContext';
import { translate } from '../../../utils/helpers';

/**
 * Renders the 'no results' component if search results returns no items.
 *
 * @component
 * @returns {JSX.Element} The 'no results' component
 */
export default function ZeroResults() {
  const { getRequestConfigs } = useRequestConfigs();
  const { query } = getRequestConfigs();
  const { translations } = useCioPlpContext();

  if (query) {
    return (
      <>
        <div className='cio-zero-results-header'>
          {translate("Sorry, we didn't find:", translations)} "{query}"
        </div>
        <ul className='cio-zero-results-option-list'>
          <li>{translate('Check for typos', translations)}</li>
          <li>{translate('Use fewer keywords', translations)}</li>
          <li>{translate('Broaden your search terms', translations)}</li>
        </ul>
      </>
    );
  }

  return (
    <>
      <div className='cio-zero-results-header'>
        {translate('Sorry, we were unable to find what you were looking for.', translations)}
      </div>
      <ul className='cio-zero-results-option-list'>
        <li>{translate('Check for typos', translations)}</li>
        <li>{translate('Use fewer keywords', translations)}</li>
        <li>{translate('Broaden your search terms', translations)}</li>
      </ul>
    </>
  );
}
