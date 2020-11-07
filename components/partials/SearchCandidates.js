/* global UIkit */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CVList from '../cv/CVList';
import { GridNoSSR, Section } from '../utils';
import FiltersSideBar from '../filters/FiltersSideBar';
import CurrentFilters from '../filters/CurrentFilters';
import { CV_FILTERS_DATA } from '../../constants';
import Icon from '../utils/Icon';
import { event } from '../../lib/gtag';
import TAGS from '../../constants/tags';
import { initializeFilters } from '../../utils';

let debounceTimeoutId;

const SearchCandidates = ({ defaultHideEmployed }) => {
  const [search, setSearch] = useState();
  const [searchBuffer, setSearchBuffer] = useState();
  const [filters, setFilters] = useState(
    initializeFilters(CV_FILTERS_DATA, defaultHideEmployed ? [2] : null)
  );
  const [numberOfResults, setNumberOfResults] = useState(0);

  const resetFilters = () => {
    setFilters(initializeFilters(CV_FILTERS_DATA));
  };

  const startSearch = (searchString) => {
    if (searchString) {
      event(TAGS.PAGE_GALERIE_RECHERCHE);
      setSearch(searchString);
    } else {
      setSearch(null);
    }
  };

  useEffect(() => {
    if(!process.env.DISABLE_SEARCH_ON_THE_FLY !== 'true') {
      clearTimeout(debounceTimeoutId);
      debounceTimeoutId = setTimeout(() => startSearch(searchBuffer), 1000);
    }
  }, [searchBuffer]);

  return (
    <Section style="default">
      <GridNoSSR
        gap="medium"
        column
        middle
        center
        eachWidths={['2-3@s', '1-1', '1-1']}
      >
        <div className="uk-text-center">
          <h2 className="uk-text-bold">
            Découvrez les <span className="uk-text-primary">candidats</span>
          </h2>
          <div>
            80 candidats motivés, en Ile-de-France et en Hauts-de-France,
            aspirent à travailler dans la vente, la restauration, le service à
            la personne, etc. A vos jobs !
          </div>
        </div>
        <div className="uk-flex uk-flex-column uk-flex-middle uk-margin-medium-top">
          <div
            style={{ maxWidth: 1000 }}
            className="uk-width-expand ent-search-bar"
          >
            <form className="uk-search uk-search-navbar uk-width-expand">
              <input
                className="uk-search-input"
                type="search"
                placeholder="Chercher un secteur d’activité, une compétence, un profil..."
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
            <a
              className="ent-search-icon uk-background-primary uk-light"
              onClick={() => {
                clearTimeout(debounceTimeoutId);
                startSearch(searchBuffer);
              }}>
              <Icon name="search" className="uk-text-secondary" />
            </a>
          </div>

          <div
            style={{ maxWidth: 1100 }}
            className="uk-width-expand uk-padding-small uk-padding-remove-vertical uk-flex uk-flex-column uk-margin-medium-top"
          >
            <CurrentFilters
              numberOfResults={numberOfResults}
              filters={filters}
              resetFilters={resetFilters}
            />
            <FiltersSideBar
              filterData={CV_FILTERS_DATA}
              filters={filters}
              setFilters={setFilters}
            />
          </div>
        </div>
        <CVList
          search={search}
          filters={{
            businessLines: filters.businessLines,
            locations: filters.locations,
          }}
          updateNumberOfResults={setNumberOfResults}
          hideEmployed={filters.hideEmployed.length > 0}
        />
      </GridNoSSR>
    </Section>
  );
};

SearchCandidates.propTypes = {
  defaultHideEmployed: PropTypes.bool,
};

SearchCandidates.defaultProps = {
  defaultHideEmployed: false,
};

export default SearchCandidates;
