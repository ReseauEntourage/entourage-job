import React from 'react';

import PropTypes from 'prop-types';
import { getChildrenFilters } from 'src/utils';
import Icon from 'src/components/utils/Icon';
import { event } from 'src/lib/gtag';
import { Button } from 'src/components/utils';

const FiltersDropdowns = ({
  filterData,
  filters,
  setFilters,
  hideOnMobile,
  fullWidth,
  showSeparator,
}) => {
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

      const id = `${key}${index}`;

      return (
        <label
          key={id}
          htmlFor={id}
          className={`uk-flex uk-flex-middle uk-text-small ${
            index < reducedFilters.length - 1 ? 'uk-margin-small-bottom' : ''
          }`}
        >
          <input
            id={id}
            style={{ marginTop: 1 }}
            type="checkbox"
            className="uk-checkbox uk-margin-small-right"
            checked={isFilterSelected}
            onChange={onFilterClick}
            onKeyDown={handleKeyDown}
          />
          <div className="uk-flex-1">{filterConst.label}</div>
        </label>
      );
    });
  };

  return (
    <div className={hideOnMobile ? 'uk-visible@m' : ''}>
      {filterData.map(({ title, constants, key, tag, type, disabled }) => {
        if (type && type === 'checkbox') {
          return null;
        }
        return (
          <div
            key={key}
            style={{ minWidth: 150 }}
            className={`uk-inline ${
              fullWidth ? 'uk-width-expand uk-margin-small-bottom' : ''
            }`}
          >
            <div
              className={`ent-select-search ${
                showSeparator ? 'ent-select-separator' : ''
              }`}
              style={{ opacity: disabled ? 0.6 : 1 }}
            >
              <Button
                disabled={disabled}
                style="text"
                className={`uk-width-expand ${
                  filters[key].length === 0 ? 'uk-text-muted' : ''
                }`}
              >
                {/* {icon && (
                  <Icon
                    name={icon}
                    ratio={0.7}
                    className="uk-margin-small-right"
                  />
                )} */}
                <span className="uk-width-expand uk-text-left uk-flex uk-flex-middle">
                  {title}
                </span>
                {filters[key].length > 0 && (
                  <div>
                    &nbsp;
                    <div className="uk-badge">{filters[key].length}</div>
                  </div>
                )}
                <Icon name="triangle-down" className="uk-margin-small-left" />
              </Button>
              <div
                data-uk-dropdown="mode: click;"
                className="uk-height-max-medium uk-overflow-auto uk-width-medium"
              >
                {renderFilters(constants, key, tag)}
              </div>
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
