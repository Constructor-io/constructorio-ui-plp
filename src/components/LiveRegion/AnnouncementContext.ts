import { createContext } from 'react';

/**
 * The current results announcement, shared so `MobileModal` can repeat it inside its
 * dialog. An `aria-modal` dialog hides everything outside it from assistive tech, so the
 * page-level live region goes silent while a modal is open. (WCAG 4.1.3)
 *
 * `undefined` outside of `CioPlpGrid`, in which case modals render no live region.
 */
const AnnouncementContext = createContext<string | undefined>(undefined);

export default AnnouncementContext;
