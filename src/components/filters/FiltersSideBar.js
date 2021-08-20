import React from 'react';

import PropTypes from 'prop-types';
import { OffcanvasNoSSR } from 'src/components/utils';
import FiltersDropdowns from './FiltersDropdowns';
import FiltersCheckboxes from './FiltersCheckboxes';

const FiltersSideBar = ({ filterData, filters, setFilters }) => {
  return (
    <OffcanvasNoSSR
      id="toggle-filter-menu"
      className="ent-filter-menu uk-padding-medium-top uk-preserve-color"
      flip={false}
    >
      <div className="uk-margin-medium-top">
        <FiltersDropdowns
          filterData={filterData}
          filters={filters}
          setFilters={setFilters}
          fullWidth
          showSeparator
        />
      </div>
      <div className="uk-margin-small-top">
        <FiltersCheckboxes
          filterData={filterData}
          filters={filters}
          setFilters={setFilters}
        />
      </div>
    </OffcanvasNoSSR>
  );
};

FiltersSideBar.propTypes = {
  filters: PropTypes.shape().isRequired,
  setFilters: PropTypes.func.isRequired,
  filterData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default FiltersSideBar;
