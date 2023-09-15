import { useCallback } from 'react';

export type CioClientConfig = { apiKey?: string };

const useCioProductCardProps = ({ customCallbackOne, customCallbackTwo }) => {
  const callbackOne = useCallback(() => {
    customCallbackOne();
    // Run the default callback for tracking here
  }, [customCallbackOne]);

  const callbackTwo = useCallback(() => {
    customCallbackTwo();
    // Run the default callback for tracking here
  }, [customCallbackTwo]);

  return {
    callbackOne,
    callbackTwo,
  };
};

export default useCioProductCardProps;
