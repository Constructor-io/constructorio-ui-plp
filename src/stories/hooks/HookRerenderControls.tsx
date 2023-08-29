import React, { PropsWithChildren, useState } from 'react';

export default function HookRerenderControls({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  const [key, setKey] = useState(1);
  const [, setRerender] = useState(1);
  return (
    <div key={key}>
      {children}
      <hr />
      <div>
        <button type='button' onClick={() => setRerender((x) => x + 1)}>
          Rerender Hook
        </button>
        <button type='button' onClick={() => setKey((x) => x + 1)}>
          Remount Hook
        </button>
      </div>
    </div>
  );
}
