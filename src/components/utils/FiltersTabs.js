import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from 'src/components/utils/Grid';
import { useRouter } from 'next/router';
import { getFiltersTagsFromQueryParamsFront } from 'src/utils';
import { usePrevious } from 'src/hooks/utils';
import _ from 'lodash';

const FiltersTabs = ({
  tabFilters,
  children,
  setTabFilters,
  otherFilterComponent,
  path,
  otherPathParams,
}) => {
  const { push, query: originalQuery } = useRouter();

  const { tag: queryTag, ...otherParams } = otherPathParams
    ? _.omit(originalQuery, otherPathParams)
    : originalQuery;

  const prevTag = usePrevious(queryTag);

  useEffect(() => {
    if (queryTag && queryTag !== prevTag) {
      const updatedFilter = getFiltersTagsFromQueryParamsFront(
        queryTag,
        tabFilters
      );
      setTabFilters(updatedFilter);
    }
  }, [tabFilters, prevTag, queryTag, setTabFilters]);

  const setTag = useCallback(
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

  return (
    <div>
      <Grid eachWidths={['expand', 'auto']}>
        <ul className="uk-subnav ent-subnav">
          {tabFilters.map(({ title, tag, active }, i) => {
            return (
              <li key={`filter-${i}`} className={active ? 'uk-active' : ''}>
                <a
                  onClick={() => {
                    return setTag(tag);
                  }}
                >
                  {title}
                </a>
              </li>
            );
          })}
        </ul>
      </Grid>
      {otherFilterComponent}
      <div className="uk-width-1-1 uk-margin-small-top">{children}</div>
    </div>
  );
};
FiltersTabs.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  setTabFilters: PropTypes.func.isRequired,
  otherFilterComponent: PropTypes.element,
  tabFilters: PropTypes.arrayOf(PropTypes.shape()),
  path: PropTypes.shape({
    href: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ pathname: PropTypes.string, query: PropTypes.shape() }),
    ]),
    as: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ pathname: PropTypes.string, query: PropTypes.shape() }),
    ]),
  }).isRequired,
  otherPathParams: PropTypes.arrayOf(PropTypes.string),
};

FiltersTabs.defaultProps = {
  children: [],
  otherFilterComponent: undefined,
  tabFilters: [],
  otherPathParams: undefined,
};

export default FiltersTabs;
