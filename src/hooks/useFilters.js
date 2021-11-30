import { useCallback } from 'react';
import {
  filtersToQueryParams,
  getFiltersObjectsFromQueryParamsFront,
} from 'src/utils';
import { useRouter } from 'next/router';
import _ from 'lodash';

export function useFilters(filtersData, path, otherPathParams) {
  const { push, query: originalQuery } = useRouter();

  const { search, ...params } = otherPathParams
    ? _.omit(originalQuery, otherPathParams)
    : originalQuery;

  const otherParams = _.omit(
    params,
    filtersData.map((filter) => {
      return filter.key;
    })
  );

  const filters = getFiltersObjectsFromQueryParamsFront(params, filtersData);

  const resetFilters = useCallback(() => {
    const query = {
      ...otherParams,
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
        : undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
  }, [otherParams, path.as, path.href, push]);

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
          : undefined,
        {
          shallow: true,
          scroll: false,
        }
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
          : undefined,
        {
          shallow: true,
          scroll: false,
        }
      );
    },
    [params, path.as, path.href, push]
  );

  return {
    filters,
    setFilters,
    search,
    setSearch,
    resetFilters,
  };
}
