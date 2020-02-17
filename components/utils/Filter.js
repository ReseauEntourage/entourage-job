import React from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR } from './Grid';

const Filter = ({ id, loading, filters, children, search }) => (
  <div uk-filter={`target: #${id}`}>
    <GridNoSSR eachWidths={['expand', 'auto']}>
      <ul className="uk-subnav ent-subnav">
        {filters.map(({ title, tag }, i) => (
          <li
            uk-filter-control={`.tag-${tag}`}
            className={i === 0 ? 'uk-active' : ''}
          >
            {/* todo to uppercase */}
            <a href="#" styles={{ textTransform: 'uppercase !important' }}>
              {title}
            </a>
          </li>
        ))}
      </ul>
      <div className="uk-margin">
        <form className="uk-search uk-search-default">
          <span data-uk-search-icon />
          <input
            className="uk-search-input"
            type="search"
            placeholder="Rechercher..."
            onChange={search}
          />
        </form>
      </div>
    </GridNoSSR>
    {loading ? (
      <div className="uk-height-medium uk-flex uk-flex-center uk-flex-middle">
        <div data-uk-spinner="" />
      </div>
    ) : (
      <ul
        id={id}
        className="uk-grid-match uk-child-width-1-2@s uk-child-width-1-3@m uk-child-width-1-4@l"
        data-uk-grid=""
        uk-height-match="target: > li .uk-card"
      >
        {children}
      </ul>
    )}
  </div>
);
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
