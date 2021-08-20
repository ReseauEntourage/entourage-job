import React, { useState, useEffect, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import FiltersMobile from 'src/components/filters/FiltersMobile';
import FiltersSideBar from 'src/components/filters/FiltersSideBar';
import FiltersCheckboxes from 'src/components/filters/FiltersCheckboxes';
import CVList from 'src/components/cv/CVList';
import { GridNoSSR, Section } from 'src/components/utils';
import FiltersOptions from 'src/components/filters/FiltersOptions';
import { CV_FILTERS_DATA, STORAGE_KEYS } from 'src/constants';
import Icon from 'src/components/utils/Icon';
import { event } from 'src/lib/gtag';
import TAGS from 'src/constants/tags';
import { DataContext } from 'src/components/store/DataProvider';
import { useFilters } from 'src/hooks';
import { useMount } from 'src/hooks/utils';
import FiltersDropdowns from 'src/components/filters/FiltersDropdowns';

let debounceTimeoutId;

const SearchCandidates = ({ defaultHideEmployed, style, isCompany }) => {
  const [search, setSearch] = useState(null);
  const [searchBuffer, setSearchBuffer] = useState();

  const { getData, storeData } = useContext(DataContext);

  const {
    filters,
    setFilters,
    numberOfResults,
    setNumberOfResults,
    resetFilters,
  } = useFilters(
    CV_FILTERS_DATA,
    defaultHideEmployed
      ? { [CV_FILTERS_DATA[0].key]: CV_FILTERS_DATA[0].constants }
      : null
  );

  const startSearch = useCallback((searchString) => {
    if (searchString) {
      event(TAGS.PAGE_GALERIE_RECHERCHE);
      setSearch(searchString);
    } else {
      setSearch(null);
    }
  }, []);

  useEffect(() => {
    if (process.env.DISABLE_SEARCH_ON_THE_FLY !== 'true') {
      clearTimeout(debounceTimeoutId);
      debounceTimeoutId = setTimeout(() => {
        return startSearch(searchBuffer);
      }, 1000);
    }
  }, [searchBuffer, startSearch]);

  useMount(() => {
    const storageItem = getData(
      isCompany
        ? STORAGE_KEYS.CV_FILTERS_COMPANY
        : STORAGE_KEYS.CV_FILTERS_PUBLIC
    );
    if (storageItem) {
      setFilters(storageItem);
    }
  });

  useEffect(() => {
    storeData(
      isCompany
        ? STORAGE_KEYS.CV_FILTERS_COMPANY
        : STORAGE_KEYS.CV_FILTERS_PUBLIC,
      filters
    );
  }, [isCompany, filters, storeData]);

  return (
    <Section style={style}>
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
            Découvrez ci-dessous les CV des candidats LinkedOut disponibles, et
            envoyez votre offre au profil qui correspond à vos besoins de
            recrutement.
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
            <FiltersMobile filters={filters} />
            <FiltersDropdowns
              hideOnMobile
              filterData={CV_FILTERS_DATA}
              filters={filters}
              setFilters={setFilters}
            />
            <a
              className="ent-search-icon uk-background-primary uk-light"
              onClick={() => {
                clearTimeout(debounceTimeoutId);
                startSearch(searchBuffer);
              }}
            >
              <Icon name="search" className="uk-text-secondary" />
            </a>
          </div>
          <FiltersSideBar
            filterData={CV_FILTERS_DATA}
            filters={filters}
            setFilters={setFilters}
          />
          <div
            style={{ maxWidth: 1000 }}
            className="uk-width-expand uk-padding-small uk-padding-remove-vertical uk-flex uk-flex-between@m uk-margin-top"
          >
            <FiltersCheckboxes
              filterData={CV_FILTERS_DATA}
              filters={filters}
              setFilters={setFilters}
              hideOnMobile
            />
            <FiltersOptions
              numberOfResults={numberOfResults}
              filters={filters}
              resetFilters={resetFilters}
            />
          </div>
        </div>
        <CVList
          search={search}
          filters={filters}
          updateNumberOfResults={setNumberOfResults}
        />
      </GridNoSSR>
    </Section>
  );
};

SearchCandidates.propTypes = {
  defaultHideEmployed: PropTypes.bool,
  isCompany: PropTypes.bool,
  style: PropTypes.oneOf(['default', 'muted']),
};

SearchCandidates.defaultProps = {
  defaultHideEmployed: false,
  style: 'default',
  isCompany: false,
};

export default SearchCandidates;
