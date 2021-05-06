import { DependencyList, useEffect, useState } from 'react';

// function useMemoAsync<T> (
const useMemoAsync = <T,>(
  factory: () => Promise<T> | undefined | null,
  deps: DependencyList,
  initialValue: T | undefined = undefined
): T | undefined => {
  const [value, setValue] = useState<T | undefined>(initialValue);

  useEffect(() => {
    let cancel = false;
    const promise = factory();

    if (promise === undefined || promise === null) {
      return;
    }

    promise.then((val) => {
      if (!cancel) {
        setValue(val);
      }
    });

    return () => {
      cancel = true;
    };
  }, deps);

  return value;
}

export default useMemoAsync;
