import React, { useEffect, useRef } from 'react';

type MobileModalProps = {
  /**
   * where to animate the modal from
   */
  side?: 'left' | 'right';
  /**
   * open state of modal
   */
  isOpen?: boolean;
  /**
   * function to update open state of modal
   */
  setIsOpen?: (b: boolean) => void;
};

export default function MobileModal(props: React.PropsWithChildren<MobileModalProps>) {
  const { side = 'left', isOpen, setIsOpen, children } = props;
  const modalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('cio-mobile-modal-backdrop-no-scroll');
      setTimeout(() => {
        modalRef.current?.classList.add('cio-mobile-modal-open');
      }, 100);
    } else {
      document.body.classList.remove('cio-mobile-modal-backdrop-no-scroll');
    }
  }, [isOpen]);

  const onClose = () => {
    modalRef.current?.classList.remove('cio-mobile-modal-open');
    modalRef.current
      ?.querySelector('.cio-mobile-modal-wrapper')
      ?.addEventListener('transitionend', () => {
        setIsOpen?.(false);
      });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <aside ref={modalRef} className={`cio-mobile-modal-container cio-mobile-modal-${side}`}>
      <div className='cio-mobile-modal-backdrop' role='presentation' onClick={onClose} />
      <div className='cio-mobile-modal-wrapper'>
        <div className='cio-mobile-modal-content'>{children}</div>
      </div>
    </aside>
  );
}
