import { useState, useCallback } from 'react';
import { initializeFilters } from '../utils';
import { OPPORTUNITY_FILTERS_DATA } from '../constants';

export function useOpportunitiesFilters() {
  const [filters, setFilters] = useState(
    initializeFilters(OPPORTUNITY_FILTERS_DATA)
  );
  const [numberOfResults, setNumberOfResults] = useState(0);

  const resetFilters = useCallback(() => {
    setFilters(initializeFilters(OPPORTUNITY_FILTERS_DATA));
  }, []);

  return {
    filters,
    setFilters,
    numberOfResults,
    setNumberOfResults,
    resetFilters,
  };
}
