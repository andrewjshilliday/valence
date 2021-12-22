import { useRef, useCallback } from 'react';

const useCallbackRef = (rawCallback: Function) => {
  const cleanupRef = useRef<any>(null);
  const callback = useCallback(
    (node) => {
      if (cleanupRef?.current != null) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      if (node) {
        cleanupRef.current = rawCallback(node);
      }
    },
    [rawCallback]
  );

  return callback;
};

export default useCallbackRef;
