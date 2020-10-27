/* global UIkit */

import React, { useState } from 'react';
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

const SearchCandidates = () => {
  const [search, setSearch] = useState();
  const [filters, setFilters] = useState(initializeFilters(CV_FILTERS_DATA));
  const [numberOfResults, setNumberOfResults] = useState(0);

  const resetFilters = () => {
    setFilters(initializeFilters(CV_FILTERS_DATA));
  };

  const startSearch = (ev) => {
    if (ev.target.value) {
      event(TAGS.PAGE_GALERIE_RECHERCHE);
      setSearch(ev.target.value);
    } else {
      setSearch(null);
    }
  };

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
                  }
                }}
                onChange={(ev) => {
                  clearTimeout(debounceTimeoutId);
                  ev.persist();
                  debounceTimeoutId = setTimeout(() => startSearch(ev), 500);
                }}
              />
            </form>
            <div className="ent-search-icon uk-background-primary uk-light">
              <Icon name="search" className="uk-text-secondary" />
            </div>
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
export default SearchCandidates;
