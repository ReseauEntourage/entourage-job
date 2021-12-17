import { useCallback } from 'react';
import { getFiltersTagsFromQueryParamsFront } from 'src/utils';
import { useRouter } from 'next/router';
import _ from 'lodash';

export function useTabFilters(filtersData, path, otherPathParams) {
  const { push, query: originalQuery } = useRouter();

  const { tag: queryTag, ...otherParams } = otherPathParams
    ? _.omit(originalQuery, otherPathParams)
    : originalQuery;

  const tabFilters = getFiltersTagsFromQueryParamsFront(queryTag, filtersData);

  const setTabFilters = useCallback(
    (tag) => {
      const query = {
        tag,
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
    },
    [otherParams, path.as, path.href, push]
  );

  return {
    tabFilters,
    setTabFilters,
  };
}
