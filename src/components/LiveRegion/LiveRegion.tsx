import React from 'react';

export type LiveRegionProps = {
  /**
   * Message to announce. Screen readers announce changes to this value without
   * moving focus. Pass an empty string to announce nothing.
   */
  message?: string;
  /**
   * How insistently assistive tech should announce updates.
   * `polite` waits for the user to be idle; `assertive` interrupts.
   * @default 'polite'
   */
  politeness?: 'polite' | 'assertive';
};

/**
 * Screen-reader-only live region for announcing asynchronous page updates
 * (filter, sort and pagination changes) that don't move focus. (WCAG 4.1.3)
 *
 * Must be rendered from page load with an empty message: assistive tech only
 * announces *changes* to a live region that already exists in the DOM, so a region
 * injected at the moment of the update is not announced at all.
 */
export default function LiveRegion({ message = '', politeness = 'polite' }: LiveRegionProps) {
  return (
    <div
      className='cio-live-region cio-visually-hidden'
      role='status'
      aria-live={politeness}
      aria-atomic='true'>
      {message}
    </div>
  );
}

LiveRegion.defaultProps = {
  message: '',
  politeness: 'polite',
};
