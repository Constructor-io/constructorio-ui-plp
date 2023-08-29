import { useCallback } from 'react';
import useCioClient from './useCioClient';

export type CioClientConfig = { apiKey?: string };

const useCioProductCardProps = ({ customCallbackOne, customCallbackTwo }, apiKey: string) => {
  const cioClient = useCioClient(apiKey);

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
