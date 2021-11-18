import { useCallback, useState } from 'react';
import {
  filtersToQueryParams,
  getFiltersObjectsFromQueryParamsFront,
  initializeFilters,
} from 'src/utils';
import { useRouter } from 'next/router';
import { useMount } from 'src/hooks/utils';
import _ from 'lodash';

export function useFilters(filtersData, defaults, path) {
  const [numberOfResults, setNumberOfResults] = useState(0);

  const {
    push,
    query: { search, ...params },
  } = useRouter();

  const otherParams = _.omit(
    params,
    filtersData.map((filter) => {
      return filter.key;
    })
  );

  const filters = getFiltersObjectsFromQueryParamsFront(params, filtersData);

  console.log('filters from params', filters);

  /* // TODO default params
  useMount(() => {
    console.log(search, Object.keys(params));
    if (!search && Object.keys(params).length === 0) {
      const query = {
        ...params,
        ..._.omitBy(
          filtersToQueryParams(initializeFilters(filtersData, defaults)),
          _.isNil
        ),
      };

      push(
        {
          pathname: path.href,
          query,
        },
        path.as
          ? {
              pathname: path.as,
              query,
            }
          : undefined
      );
    }
  }); */

  const resetFilters = useCallback(() => {
    console.log('reset');

    const query = {
      ...otherParams,
      ..._.omitBy(
        filtersToQueryParams(initializeFilters(filtersData)),
        _.isNil
      ),
    };

    push(
      {
        pathname: path.href,
        query,
      },
      path.as
        ? {
            pathname: path.as,
            query,
          }
        : undefined
    );
  }, [filtersData, otherParams, path.as, path.href, push]);

  const setFilters = useCallback(
    (updatedFilters) => {
      const searchFilter = search ? { search } : {};

      const query = {
        ...otherParams,
        ..._.omitBy(filtersToQueryParams(updatedFilters), _.isNil),
        ...searchFilter,
      };

      push(
        {
          pathname: path.href,
          query,
        },
        path.as
          ? {
              pathname: path.as,
              query,
            }
          : undefined
      );
    },
    [otherParams, path.as, path.href, push, search]
  );

  const setSearch = useCallback(
    (updatedSearch) => {
      const searchFilter = updatedSearch ? { search: updatedSearch } : {};
      const query = {
        ...params,
        ...searchFilter,
      };
      push(
        {
          pathname: path.href,
          query,
        },
        path.as
          ? {
              pathname: path.as,
              query,
            }
          : undefined
      );
    },
    [params, path.as, path.href, push]
  );

  return {
    filters,
    setFilters,
    search,
    setSearch,
    numberOfResults,
    setNumberOfResults,
    resetFilters,
  };
}
