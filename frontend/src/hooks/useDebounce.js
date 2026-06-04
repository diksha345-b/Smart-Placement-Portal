import { useEffect, useState } from 'react';

/**
 * Returns a debounced copy of a value. Useful for search inputs so we don't
 * fire an API request on every keystroke.
 */
export const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
};
