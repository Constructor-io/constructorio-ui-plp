import { useRef, useEffect } from 'react';

export default function useFirstRender() {
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return { isFirstRender: firstRender.current };
}
