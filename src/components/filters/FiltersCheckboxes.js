import React from 'react';

import PropTypes from 'prop-types';
import { event } from 'src/lib/gtag';

const FiltersCheckboxes = ({
  filterData,
  filters,
  setFilters,
  hideOnMobile,
  fullWidth,
}) => {
  return (
    <div
      className={`uk-flex uk-flex-middle ${
        hideOnMobile ? 'uk-visible@m' : ''
      } uk-margin-small-bottom`}
    >
      {filterData.map(({ title, constants, key, tag, type, disabled }) => {
        if (filters[key]) {
          if (type && type === 'checkbox') {
            return (
              <div key={key} className={fullWidth ? 'uk-flex-1' : ''}>
                <label
                  htmlFor={key}
                  className="uk-flex uk-flex-middle uk-text-small"
                  style={{ height: 20, opacity: disabled ? 0.6 : 1 }}
                >
                  <div className="uk-flex-1">{title}</div>
                  <input
                    disabled={disabled}
                    id={key}
                    style={{ marginTop: 2 }}
                    type="checkbox"
                    className="uk-checkbox uk-margin-small-left"
                    checked={filters[key].length > 0 && !filters[key][0].value}
                    onChange={(e) => {
                      const updatedFilters = JSON.parse(
                        JSON.stringify(filters)
                      );
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
        }
        return undefined;
      })}
    </div>
  );
};

FiltersCheckboxes.propTypes = {
  filters: PropTypes.shape().isRequired,
  setFilters: PropTypes.func.isRequired,
  filterData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  hideOnMobile: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

FiltersCheckboxes.defaultProps = {
  hideOnMobile: false,
  fullWidth: false,
};

export default FiltersCheckboxes;
