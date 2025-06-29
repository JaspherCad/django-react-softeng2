import { useState, useEffect } from 'react';


//JUST delays the SearchTerm
export function customDebounceHook(value, delay=500) {
  const [debouncedValue, setDebouncedValue] = useState(value);


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    //Cleanup: RESTART the timer if value or delay changes
    return () => {
      clearTimeout(timer);
      
    };
  }, [value, delay]);

  return debouncedValue;
}
