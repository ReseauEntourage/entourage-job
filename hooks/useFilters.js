import { useState, useCallback } from 'react';
import { initializeFilters } from '../utils';

export function useFilters(filtersData, defaults) {
  const [filters, setFilters] = useState(
    initializeFilters(filtersData, defaults)
  );
  const [numberOfResults, setNumberOfResults] = useState(0);

  const resetFilters = useCallback(() => {
    setFilters(initializeFilters(filtersData));
  }, [filtersData]);

  return {
    filters,
    setFilters,
    numberOfResults,
    setNumberOfResults,
    resetFilters,
  };
}
