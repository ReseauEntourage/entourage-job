import React from 'react';

import PropTypes from 'prop-types';
import { event } from '../../lib/gtag';

const FiltersDropdowns = ({
  filterData,
  filters,
  setFilters,
  hideOnMobile,
  fullWidth,
  showSeparator,
}) => {
  return (
    <div className={hideOnMobile ? 'uk-visible@m' : ''}>
      {filterData.map(({ title, constants, key, tag, type }) => {
        const mutatedConstants = [{ label: title, value: '' }, ...constants];
        if (type && type === 'checkbox') {
          return null;
        }
        return (
          <div
            key={key}
            className={`uk-inline ${
              fullWidth ? 'uk-width-expand' : 'uk-width-small'
            }`}
          >
            <div
              className={`uk-form-controls ent-select-search ${
                showSeparator ? 'ent-select-separator' : ''
              }`}
            >
              <select
                className={`uk-select ${
                  !filters[key][0] ? 'uk-text-muted' : ''
                }`}
                onChange={({ target: { value } }) => {
                  const updatedFilters = { ...filters };
                  const selectedFilter = constants.find((filterConst) => {
                    return filterConst.value === value;
                  });
                  updatedFilters[key] = selectedFilter ? [selectedFilter] : [];
                  if (tag) event(tag);

                  setFilters(updatedFilters);
                }}
                name={key}
                placeholder={title}
                value={filters[key][0] ? filters[key][0].value : ''}
                style={{
                  backgroundColor: 'transparent',
                  paddingLeft: 0,
                  border: 'initial',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {mutatedConstants.map((item, i) => {
                  return (
                    <option value={item.value} key={i}>
                      {item.label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );
};

FiltersDropdowns.propTypes = {
  filters: PropTypes.shape().isRequired,
  setFilters: PropTypes.func.isRequired,
  filterData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  hideOnMobile: PropTypes.bool,
  fullWidth: PropTypes.bool,
  showSeparator: PropTypes.bool,
};

FiltersDropdowns.defaultProps = {
  hideOnMobile: false,
  fullWidth: false,
  showSeparator: false,
};

export default FiltersDropdowns;
