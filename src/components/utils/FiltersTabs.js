import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'src/components/utils/Grid';

const FiltersTabs = ({
  children,
  tabFilters,
  setTabFilters,
  otherFilterComponent,
}) => {
  return (
    <div>
      <Grid eachWidths={['expand', 'auto']}>
        <ul className="uk-subnav ent-subnav">
          {tabFilters.map(({ title, tag, active }, i) => {
            return (
              <li key={`filter-${i}`} className={active ? 'uk-active' : ''}>
                <a
                  onClick={() => {
                    return setTabFilters(tag);
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
};

FiltersTabs.defaultProps = {
  children: [],
  otherFilterComponent: null,
  tabFilters: [],
};

export default FiltersTabs;
