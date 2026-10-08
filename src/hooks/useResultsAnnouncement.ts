import { useEffect, useRef, useState } from 'react';
import { RequestStatus } from '../components/CioPlpGrid/reducer';
import { Nullable, PlpBrowseData, PlpSearchData, Translations } from '../types';
import { isPlpSearchDataRedirect } from '../utils';
import { translate } from '../utils/helpers';

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
 * Builds the screen reader announcement for asynchronous result updates — filter, sort
 * and pagination changes all settle through the same request status, so one announcement
 * covers them rather than one per interaction. (WCAG 4.1.3)
 *
 * The initial load is deliberately silent: the screen reader is already announcing the
 * document at that point, and announcing here would talk over it.
 *
 * @returns The message to render into the live region; empty string announces nothing.
 */
export default function useResultsAnnouncement({
  status,
  data,
  translations,
}: UseResultsAnnouncementProps): string {
  const [announcement, setAnnouncement] = useState('');
  const hasSettledOnceRef = useRef(false);
  const totalNumResults =
    data && !isPlpSearchDataRedirect(data) ? data.response?.totalNumResults : undefined;

  useEffect(() => {
    if (status === RequestStatus.FETCHING) {
      if (hasSettledOnceRef.current) {
        setAnnouncement(translate('Loading results', translations));
      }
      return;
    }

    if (status !== RequestStatus.SUCCESS || totalNumResults === undefined) return;

    if (!hasSettledOnceRef.current) {
      hasSettledOnceRef.current = true;
      return;
    }

    setAnnouncement(
      totalNumResults === 0
        ? translate('No results found', translations)
        : `${totalNumResults} ${translate('results found', translations)}`,
    );
  }, [status, totalNumResults, translations]);

  return announcement;
}
