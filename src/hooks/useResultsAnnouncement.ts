import { useEffect, useRef, useState } from 'react';
import { RequestStatus } from '../components/CioPlpGrid/reducer';
import { Nullable, PlpBrowseData, PlpSearchData, Translations } from '../types';
import { isPlpSearchDataRedirect } from '../utils';
import { translate, translateWithParams } from '../utils/helpers';

export interface UseResultsAnnouncementProps {
  /**
   * Current request status, as returned by `useCioPlp`.
   */
  status?: Nullable<RequestStatus>;
  /**
   * Current response, as returned by `useCioPlp`. Redirect payloads carry no results
   * and are ignored.
   */
  data?: Nullable<PlpSearchData | PlpBrowseData>;
  /**
   * Translations from the provider context.
   */
  translations?: Translations;
}

/**
 * Delay before a message is written into the live region. Gives assistive tech time to
 * register a freshly mounted, empty region (otherwise the first message is dropped), and
 * lets an identical consecutive message be re-announced after the region is cleared.
 */
export const ANNOUNCEMENT_DELAY_MS = 500;

export function getResultsMessage(totalNumResults: number, translations?: Translations) {
  if (totalNumResults === 0) return translate('No results found', translations);
  if (totalNumResults === 1) return translate('1 result found', translations);
  return translateWithParams('{count} results found', { count: totalNumResults }, translations);
}

/**
 * Builds the screen reader announcement for result updates — filter, sort and pagination
 * changes all settle through the same request status, so one announcement covers them
 * rather than one per interaction. (WCAG 4.1.3)
 *
 * Results are announced on load too, including hydrated (`initialSearchResponse` /
 * `initialBrowseResponse`) results: with the default URL helpers every filter, sort and
 * pagination change reloads the page, so that load is the only feedback the user gets.
 *
 * @returns The message to render into the live region; empty string announces nothing.
 */
export default function useResultsAnnouncement({
  status,
  data,
  translations,
}: UseResultsAnnouncementProps): string {
  const [announcement, setAnnouncement] = useState('');
  const hasAnnouncedResultsRef = useRef(false);
  const results = data && !isPlpSearchDataRedirect(data) ? data : null;
  const totalNumResults = results?.response?.totalNumResults;
  const resultId = results?.resultId;

  // Derived as strings so a new `translations` object with the same content is a no-op
  const loadingMessage = translate('Loading results', translations);
  const resultsMessage =
    totalNumResults !== undefined ? getResultsMessage(totalNumResults, translations) : '';

  useEffect(() => {
    let nextMessage = '';

    if (status === RequestStatus.FETCHING) {
      // Nothing to replace on the very first fetch, so there's nothing worth interrupting for
      if (hasAnnouncedResultsRef.current) nextMessage = loadingMessage;
    } else if (status !== RequestStatus.ERROR && resultsMessage) {
      hasAnnouncedResultsRef.current = true;
      nextMessage = resultsMessage;
    }

    if (!nextMessage) return undefined;

    setAnnouncement('');
    const timeout = setTimeout(() => setAnnouncement(nextMessage), ANNOUNCEMENT_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [status, resultId, loadingMessage, resultsMessage]);

  return announcement;
}
