import React, { useState } from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MobileModal from '../../../src/components/MobileModal';

function Wrapper({ label, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button type='button' onClick={() => setIsOpen(true)}>
        Open
      </button>
      <MobileModal isOpen={isOpen} setIsOpen={setIsOpen} label={label}>
        {children || 'Content'}
      </MobileModal>
    </div>
  );
}

describe('MobileModal Component', () => {
  it('renders the modal when open', () => {
    const { getByText, queryByText } = render(<Wrapper />);

    expect(queryByText('Content')).not.toBeInTheDocument();

    fireEvent.click(getByText('Open'));

    expect(getByText('Content')).toBeInTheDocument();
  });

  it('should dismiss modal when clicking in backdrop', () => {
    const { getByText, queryByText, getByRole } = render(<Wrapper />);

    fireEvent.click(getByText('Open'));

    expect(getByText('Content')).toBeInTheDocument();

    fireEvent.click(getByRole('presentation'));

    waitFor(() => {
      expect(queryByText('Content')).not.toBeInTheDocument();
    });
  });

  it('exposes dialog semantics and an accessible name', () => {
    const { getByText, getByRole } = render(<Wrapper label='Filters' />);

    fireEvent.click(getByText('Open'));

    const dialog = getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Filters');
  });

  it('moves focus into the dialog on open and restores it on close', async () => {
    const { getByText, getByRole } = render(<Wrapper />);
    const trigger = getByText('Open');

    trigger.focus();
    fireEvent.click(trigger);

    // Focus lands on the first focusable element inside, or the dialog itself
    const dialog = getByRole('dialog');
    const firstFocusable = dialog.querySelector('button');
    expect(document.activeElement).toBe(firstFocusable || dialog);

    fireEvent.keyDown(dialog, { key: 'Escape' });

    await waitFor(() => {
      expect(document.activeElement).toBe(trigger);
    });
  });

  it('closes on Escape', async () => {
    const { getByText, queryByText, getByRole } = render(<Wrapper />);

    fireEvent.click(getByText('Open'));
    expect(getByText('Content')).toBeInTheDocument();

    fireEvent.keyDown(getByRole('dialog'), { key: 'Escape' });

    await waitFor(() => {
      expect(queryByText('Content')).not.toBeInTheDocument();
    });
  });

  it('cycles Tab within the dialog instead of escaping to the page behind', () => {
    const { getByText, getByRole } = render(
      <Wrapper>
        <button type='button'>First</button>
        <button type='button'>Last</button>
      </Wrapper>,
    );

    fireEvent.click(getByText('Open'));

    const dialog = getByRole('dialog');
    const first = getByText('First');
    const last = getByText('Last');

    last.focus();
    fireEvent.keyDown(dialog, { key: 'Tab' });
    expect(document.activeElement).toBe(first);

    first.focus();
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
  });
});
