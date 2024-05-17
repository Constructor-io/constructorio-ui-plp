import React from 'react';

export default function Spinner() {
  return (
    <div className='cio-plp-loading'>
      <div className='cio-spinner' data-testid='cio-spinner'>
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}
