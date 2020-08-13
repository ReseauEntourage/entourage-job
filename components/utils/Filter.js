import React from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR } from './Grid';

const Filter = ({ id, loading, filters, children, search }) => {
  if (filters.length > 0 && !filters.some(({ active }) => active)) {
    filters[0].active = true;
  }
  return (
    <div uk-filter={`target: #${id}`}>
      <GridNoSSR eachWidths={['expand', 'auto']}>
        <ul className="uk-subnav ent-subnav">
          {filters.map(({ title, tag, active }, i) => (
            <li
              key={i}
              uk-filter-control={`.tag-${tag}`}
              className={active ? 'uk-active' : ''}
            >
              {/* todo to uppercase */}
              <a href="#" styles={{ textTransform: 'uppercase !important' }}>
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
              onChange={search}
            />
          </div>
        </div>
      </GridNoSSR>
      {loading ? (
        <div className="uk-height-medium uk-flex uk-flex-center uk-flex-middle">
          <div data-uk-spinner="" />
        </div>
      ) : (
        <GridNoSSR
          id={id}
          childWidths={['1-4@l', '1-3@m', '1-2@s']}
          left
          top
        >
          {children}
        </GridNoSSR>
      )}
    </div>
  );
};
Filter.propTypes = {
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  filters: PropTypes.arrayOf(PropTypes.shape).isRequired,
  children: PropTypes.arrayOf(PropTypes.element),
  search: PropTypes.func,
};
Filter.defaultProps = {
  children: [],
  search: null,
  loading: false,
};

export default Filter;
