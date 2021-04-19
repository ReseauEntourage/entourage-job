import React from 'react';

import PropTypes from 'prop-types';
import { getChildrenFilters } from '../../utils';
import { event } from '../../lib/gtag';
import { Button, IconNoSSR, OffcanvasNoSSR } from '../utils';

const FiltersSideBar = ({ filterData, filters, setFilters }) => {
  const renderFilters = (filterConstants, key, tag) => {
    const reducedFilters = getChildrenFilters(filterConstants);

    return reducedFilters.map((filterConst, index) => {
      const indexInSelectedFilters = filters[key].findIndex((filter) => {
        return filter.value === filterConst.value;
      });

      const isFilterSelected = indexInSelectedFilters > -1;

      const onFilterClick = () => {
        const updatedFilters = { ...filters };
        if (isFilterSelected) {
          // remove filter
          updatedFilters[key].splice(indexInSelectedFilters, 1);
        } else {
          // add filter
          updatedFilters[key].push(filterConst);
          if (tag) event(tag);
        }

        setFilters(updatedFilters);
      };

      const handleKeyDown = (ev) => {
        if (ev.key === 'Enter') {
          onFilterClick();
        }
      };

      return (
        <div key={key + index} style={{ paddingLeft: 10, paddingTop: 10 }}>
          <div
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className={`ent-filter${isFilterSelected ? '-activated' : ''}`}
            onClick={onFilterClick}
          >
            {filterConst.label}
          </div>
        </div>
      );
    });
  };

  return (
    <OffcanvasNoSSR
      id="toggle-filter-menu"
      className="ent-filter-menu uk-padding-medium-top"
      flip={false}
    >
      <div className="uk-margin-small-top">
        {filterData.map(({ title, constants, key, tag, type }) => {
          if (type && type === 'checkbox') {
            return (
              <div key={key}>
                <label
                  htmlFor="hide-employed"
                  className="uk-text-bold uk-flex uk-flex-middle"
                >
                  <div className="uk-flex-1">{title}</div>
                  <input
                    id="hide-employed"
                    type="checkbox"
                    className="uk-checkbox uk-margin-small-left"
                    checked={filters[key].length > 0}
                    onChange={(e) => {
                      const updatedFilters = { ...filters };
                      updatedFilters[key] = e.target.checked
                        ? [constants[0]]
                        : [];
                      setFilters(updatedFilters);
                    }}
                  />
                </label>
              </div>
            );
          }
          return (
            <div key={key}>
              <span className="uk-text-bold">{title}</span>
              <div className="uk-flex uk-flex-wrap uk-margin-medium-bottom uk-margin-small-top">
                {renderFilters(constants, key, tag)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="uk-flex uk-flex-center uk-margin-medium-top">
        <Button style="text" toggle="target: #toggle-filter-menu;">
          Fermer la liste &nbsp;
          <IconNoSSR ratio={1} name="close" />
        </Button>
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
