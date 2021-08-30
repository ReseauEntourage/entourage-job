import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import FiltersMobile from 'src/components/filters/FiltersMobile';
import FiltersSideBar from 'src/components/filters/FiltersSideBar';
import FiltersCheckboxes from 'src/components/filters/FiltersCheckboxes';
import FiltersOptions from 'src/components/filters/FiltersOptions';
import Icon from 'src/components/utils/Icon';
import { event } from 'src/lib/gtag';
import FiltersDropdowns from 'src/components/filters/FiltersDropdowns';

let debounceTimeoutId;
const MAX_WIDTH = 1100;

const SearchBar = ({
  filtersConstants,
  filters,
  setFilters,
  numberOfResults,
  setSearch,
  resetFilters,
  placeholder,
  startSearchEvent,
}) => {
  const [searchBuffer, setSearchBuffer] = useState();

  const startSearch = useCallback(
    (searchString) => {
      if (searchString) {
        if (startSearchEvent) event(startSearchEvent);
        setSearch(searchString);
      } else {
        setSearch();
      }
    },
    [setSearch, startSearchEvent]
  );

  useEffect(() => {
    if (process.env.DISABLE_SEARCH_ON_THE_FLY !== 'true') {
      clearTimeout(debounceTimeoutId);
      debounceTimeoutId = setTimeout(() => {
        return startSearch(searchBuffer);
      }, 1000);
    }
  }, [searchBuffer, startSearch]);

  return (
    <div className="uk-flex uk-flex-column uk-flex-middle">
      <div
        style={{ maxWidth: MAX_WIDTH }}
        className="uk-width-expand ent-search-bar"
      >
        <form className="uk-search uk-search-navbar uk-width-expand">
          <input
            className="uk-search-input"
            type="search"
            placeholder={placeholder}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter') {
                ev.preventDefault();
                clearTimeout(debounceTimeoutId);
                startSearch(searchBuffer);
              }
            }}
            onChange={(ev) => {
              setSearchBuffer(ev.target.value);
            }}
          />
        </form>
        <FiltersMobile filters={filters} />
        <FiltersDropdowns
          hideOnMobile
          filterData={filtersConstants}
          filters={filters}
          setFilters={setFilters}
        />
        <a
          className="ent-search-icon uk-background-primary uk-light"
          onClick={() => {
            clearTimeout(debounceTimeoutId);
            startSearch(searchBuffer);
          }}
        >
          <Icon name="search" className="uk-text-secondary" />
        </a>
      </div>
      <FiltersSideBar
        filterData={filtersConstants}
        filters={filters}
        setFilters={setFilters}
      />
      <div
        style={{ maxWidth: MAX_WIDTH }}
        className="uk-width-expand uk-padding-small uk-padding-remove-vertical uk-flex uk-flex-between@m uk-margin-top"
      >
        <FiltersCheckboxes
          filterData={filtersConstants}
          filters={filters}
          setFilters={setFilters}
          hideOnMobile
        />
        <FiltersOptions
          numberOfResults={numberOfResults}
          filters={filters}
          resetFilters={resetFilters}
        />
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  filtersConstants: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  filters: PropTypes.shape().isRequired,
  setFilters: PropTypes.func.isRequired,
  numberOfResults: PropTypes.number.isRequired,
  setSearch: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  startSearchEvent: PropTypes.shape({
    action: PropTypes.string.isRequired,
  }),
};

SearchBar.defaultProps = {
  placeholder: 'Rechercher...',
  startSearchEvent: undefined,
};

export default SearchBar;
