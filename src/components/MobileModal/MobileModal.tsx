import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

type MobileModalProps = {
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
};

export default function MobileModal(props: React.PropsWithChildren<MobileModalProps>) {
  const { side = 'left', isOpen, setIsOpen, children } = props;
  const modalRef = useRef<HTMLElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.classList.add('cio-mobile-modal-backdrop-no-scroll');
    } else {
      document.body.classList.remove('cio-mobile-modal-backdrop-no-scroll');
    }
  }, [isOpen]);

  const onClose = () => {
    setIsAnimating(false);
    modalRef.current
      ?.querySelector('.cio-mobile-modal-wrapper')
      ?.addEventListener('transitionend', () => {
        setIsOpen(false);
      });
  };

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
        <div className='cio-mobile-modal-content'>{children}</div>
      </div>
    </aside>
  );
}
