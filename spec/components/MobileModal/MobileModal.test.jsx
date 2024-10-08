import React, { useState } from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MobileModal from '../../../src/components/MobileModal';

function Wrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button type='button' onClick={() => setIsOpen(true)}>
        Open
      </button>
      <MobileModal isOpen={isOpen} setIsOpen={setIsOpen}>
        Content
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
});
