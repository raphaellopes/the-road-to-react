import { useState, useEffect, useRef } from 'react';

export const useSemiPersistentState = (
  key:string,
  initialValue:string
):[string, (newValue:string) => void] => {
  const isMounted = useRef(false);
  const [value, setValue] = useState(localStorage.getItem(key) || initialValue);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
}
