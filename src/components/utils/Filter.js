import React from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR } from 'src/components/utils/Grid';

let debounceTimeoutId;

const Filter = ({
  loading,
  filters,
  children,
  search,
  setFilters,
  otherFilterComponent,
}) => {
  if (
    filters.length > 0 &&
    !filters.some(({ active }) => {
      return active;
    })
  ) {
    filters[0].active = true;
  }

  return (
    <div>
      <GridNoSSR eachWidths={['expand', 'auto']}>
        <ul className="uk-subnav ent-subnav">
          {filters.map(({ title, tag, active }, i) => {
            return (
              <li key={`filter-${i}`} className={active ? 'uk-active' : ''}>
                <a
                  onClick={() => {
                    const updatedFilters = [...filters];
                    const filterToDeActivate = updatedFilters.find((filter) => {
                      return filter.active;
                    });
                    const filterToActivate = updatedFilters.find((filter) => {
                      return filter.tag === tag;
                    });
                    filterToDeActivate.active = false;
                    filterToActivate.active = true;
                    setFilters(updatedFilters);
                  }}
                >
                  {title}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="uk-margin">
          <div className="uk-search uk-search-default">
            <span data-uk-search-icon />
            <input
              className="uk-search-input"
              type="search"
              placeholder="Rechercher..."
              onKeyDown={(ev) => {
                if (ev.key === 'Enter') {
                  ev.preventDefault();
                }
              }}
              onChange={(event) => {
                clearTimeout(debounceTimeoutId);
                event.persist();
                debounceTimeoutId = setTimeout(() => {
                  return search(event.target.value);
                }, 1000);
              }}
            />
          </div>
        </div>
      </GridNoSSR>
      {otherFilterComponent}
      {loading ? (
        <div className="uk-text-center">
          <div data-uk-spinner />
        </div>
      ) : (
        <div className="uk-width-1-1">{children}</div>
      )}
    </div>
  );
};
Filter.propTypes = {
  loading: PropTypes.bool,
  filters: PropTypes.arrayOf(PropTypes.shape).isRequired,
  children: PropTypes.arrayOf(PropTypes.element),
  search: PropTypes.func,
  setFilters: PropTypes.func.isRequired,
  otherFilterComponent: PropTypes.element,
};
Filter.defaultProps = {
  children: [],
  search: null,
  loading: false,
  otherFilterComponent: undefined,
};

export default Filter;
