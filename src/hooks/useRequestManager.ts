import { useRef, useCallback } from 'react';
import { RequestManager } from 'utils/requestManager';

export const useRequestManager = () => {
  const managerRef = useRef(new RequestManager());

  const executeOnce = useCallback(
    <T,>(key: string, requestFn: () => Promise<T>) => {
      return managerRef.current.executeOnce(key, requestFn);
    },
    []
  );

  const cancel = useCallback((key: string) => {
    managerRef.current.cancel(key);
  }, []);

  const clearAll = useCallback(() => {
    managerRef.current.clearAll();
  }, []);

  const getPendingCount = useCallback(() => {
    return managerRef.current.getPendingCount();
  }, []);

  return {
    executeOnce,
    cancel,
    clearAll,
    getPendingCount
  };
};
