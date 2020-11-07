import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR } from './Grid';

let debounceTimeoutId;

const Filter = ({
  loading,
  filters,
  children,
  search,
  setFilters,
  otherFilterComponent,
}) => {
  if (filters.length > 0 && !filters.some(({ active }) => active)) {
    filters[0].active = true;
  }

  return (
    <div>
      <GridNoSSR eachWidths={['expand', 'auto']}>
        <ul className="uk-subnav ent-subnav">
          {filters.map(({ title, tag, active }, i) => (
              <li key={`filter-${i}`} className={active ? 'uk-active' : ''}>
                <a
                  onClick={() => {
                    const updatedFilters = [...filters];
                    const filterToDeActivate = updatedFilters.find(
                      (filter) => filter.active
                    );
                    const filterToActivate = updatedFilters.find(
                      (filter) => filter.tag === tag
                    );
                    filterToDeActivate.active = false;
                    filterToActivate.active = true;
                    setFilters(updatedFilters);
                  }}
                >
                  {title}
                </a>
              </li>
            ))}
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
                debounceTimeoutId = setTimeout(() => search(event), 1000);
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
        <ul
          className="uk-child-width-1-2@s uk-child-width-1-3@m uk-child-width-1-4@l"
          data-uk-grid=""
        >
          {children}
        </ul>
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
  loading: true,
  otherFilterComponent: undefined,
};

export default Filter;
