import React from 'react';

import PropTypes from 'prop-types';
import { event } from '../../lib/gtag';

const FiltersCheckboxes = ({
  filterData,
  filters,
  setFilters,
  hideOnMobile,
}) => {
  return (
    <div
      className={`uk-flex uk-flex-middle ${hideOnMobile ? 'uk-visible@m' : ''}`}
    >
      {filterData.map(({ title, constants, key, tag, type }) => {
        if (type && type === 'checkbox') {
          return (
            <div key={key}>
              <label
                htmlFor="hide-employed"
                className="uk-flex uk-flex-middle uk-text-small"
                style={{ height: 20 }}
              >
                <div className="uk-flex-1">{title}</div>
                <input
                  id={key}
                  style={{ marginTop: 2 }}
                  type="checkbox"
                  className="uk-checkbox uk-margin-small-left"
                  checked={filters[key].length > 0}
                  onChange={(e) => {
                    const updatedFilters = { ...filters };
                    updatedFilters[key] = e.target.checked
                      ? [constants[0]]
                      : [];
                    if (tag) event(tag);
                    setFilters(updatedFilters);
                  }}
                />
              </label>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

FiltersCheckboxes.propTypes = {
  filters: PropTypes.shape().isRequired,
  setFilters: PropTypes.func.isRequired,
  filterData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  hideOnMobile: PropTypes.bool,
};

FiltersCheckboxes.defaultProps = {
  hideOnMobile: false,
};

export default FiltersCheckboxes;
