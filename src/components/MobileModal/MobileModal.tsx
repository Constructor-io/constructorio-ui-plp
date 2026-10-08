import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export type MobileModalProps = {
  /**
   * where to animate the modal from
   */
  side?: 'left' | 'right';
  /**
   * open state of modal
   */
  isOpen: boolean;
  /**
   * function to update open state of modal
   */
  setIsOpen: (b: boolean) => void;
  /**
   * Accessible name for the dialog, announced by screen readers on open.
   * @default 'Dialog'
   */
  label?: string;
};

/**
 * Selector for elements that can receive keyboard focus, used to scope the focus trap.
 * `[tabindex="-1"]` is excluded since those are programmatically focusable only.
 */
/**
 * Fallback for the close transition, matching `transition-duration` in MobileModal.css.
 * `transitionend` does not fire when the transition is skipped — no stylesheet loaded,
 * `prefers-reduced-motion`, or a hidden element — which would otherwise leave the modal
 * stuck open after Escape or a backdrop click.
 */
const CLOSE_TRANSITION_FALLBACK_MS = 300;

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function MobileModal(props: React.PropsWithChildren<MobileModalProps>) {
  const { side = 'left', isOpen, setIsOpen, label = 'Dialog', children } = props;
  const modalRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // Element that had focus before the modal opened, so it can be restored on close.
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.classList.add('cio-mobile-modal-backdrop-no-scroll');
    } else {
      document.body.classList.remove('cio-mobile-modal-backdrop-no-scroll');
    }
  }, [isOpen]);

  // Move focus into the dialog on open and restore it to the trigger on close, so
  // keyboard and screen reader users aren't left focused behind the backdrop.
  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const firstFocusable = contentRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (firstFocusable || contentRef.current)?.focus();

    return () => {
      previouslyFocusedRef.current?.focus?.();
    };
  }, [isOpen]);

  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const onClose = useCallback(() => {
    setIsAnimating(false);

    let hasClosed = false;
    const close = () => {
      if (hasClosed) return;
      hasClosed = true;
      clearTimeout(closeTimeoutRef.current);
      setIsOpen(false);
    };

    modalRef.current
      ?.querySelector('.cio-mobile-modal-wrapper')
      ?.addEventListener('transitionend', close);

    closeTimeoutRef.current = setTimeout(close, CLOSE_TRANSITION_FALLBACK_MS);
  }, [setIsOpen]);

  useEffect(() => () => clearTimeout(closeTimeoutRef.current), []);

  // Escape closes; Tab cycles within the dialog rather than escaping to the page behind.
  // Attached natively rather than as a JSX prop so the dialog container itself does not
  // need to be treated as an interactive element.
  useEffect(() => {
    const dialog = contentRef.current;
    if (!isOpen || !dialog) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const { activeElement } = document;

      if (event.shiftKey && (activeElement === first || activeElement === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    dialog.addEventListener('keydown', handleKeyDown);
    return () => dialog.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <aside
      ref={modalRef}
      className={classNames(`cio-mobile-modal-container cio-mobile-only cio-mobile-modal-${side}`, {
        'cio-mobile-modal-open': isAnimating,
      })}>
      <div className='cio-mobile-modal-backdrop' role='presentation' onClick={onClose} />
      <div className='cio-mobile-modal-wrapper'>
        <div
          ref={contentRef}
          className='cio-mobile-modal-content'
          role='dialog'
          aria-modal='true'
          aria-label={label}
          tabIndex={-1}>
          {children}
        </div>
      </div>
    </aside>
  );
}

MobileModal.defaultProps = {
  side: 'left',
  label: 'Dialog',
};
