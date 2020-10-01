/* global UIkit */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CVList from '../cv/CVList';
import {
  Button,
  OffcanvasNoSSR,
  GridNoSSR,
  IconNoSSR,
  Section,
} from '../utils';
import ButtonIcon from '../utils/ButtonIcon';
import { FILTERS_DATA } from '../../constants';
import { getChildrenFilters } from '../../utils';
import Icon from '../utils/Icon';
import { event } from '../../lib/gtag';
import TAGS from '../../constants/tags';

let debounceTimeoutId;

const initializeFilters = () => {
  return FILTERS_DATA.reduce((acc, curr) => {
    acc[curr.key] = [];
    return acc;
  }, {});
};

const CVFiltersSideBar = ({
  filters,
  setFilters,
  hideEmployed,
  setHideEmployed,
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
          updatedFilters[key].splice(index, 1);
        } else {
          // add filter
          updatedFilters[key].push(filterConst);
          event(tag);
        }

        setFilters(updatedFilters);
      };

      const handleKeyDown = (ev) => {
        if (ev.key === 'Enter') {
          onFilterClick();
        }
      };

      return (
        <div key={key + index} style={{ paddingLeft: 10, paddingTop: 10 }}>
          <div
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className={`ent-filter${isFilterSelected ? '-activated' : ''}`}
            onClick={onFilterClick}
          >
            {filterConst.label}
          </div>
        </div>
      );
    });
  };

  return (
    <OffcanvasNoSSR
      id="toggle-filter-menu"
      className="ent-filter-menu uk-padding-medium-top"
      flip={false}
    >
      <div className="uk-margin-small-top">
        {FILTERS_DATA.map(({ title, constants, key, tag }) => {
          return (
            <div key={key}>
              <span className="uk-text-bold">{title}</span>
              <div className="uk-flex uk-flex-wrap uk-margin-medium-bottom uk-margin-small-top">
                {renderFilters(constants, key, tag)}
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <label
          htmlFor="hide-employed"
          className="uk-text-bold uk-flex uk-flex-middle"
        >
          <div className="uk-flex-1">
            Masquer les candidats ayant retrouvé un emploi
          </div>
          <input
            id="hide-employed"
            type="checkbox"
            className="uk-checkbox uk-margin-small-left"
            checked={hideEmployed}
            onChange={(e) => setHideEmployed(e.target.checked)}
          />
        </label>
      </div>
      <div className="uk-flex uk-flex-center uk-margin-medium-top">
        <Button style="text" toggle="target: #toggle-filter-menu;">
          Fermer la liste &nbsp;
          <IconNoSSR ratio={1} name="close" />
        </Button>
      </div>
    </OffcanvasNoSSR>
  );
};

CVFiltersSideBar.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  hideEmployed: PropTypes.bool.isRequired,
  setHideEmployed: PropTypes.func.isRequired,
};

const SearchCandidates = () => {
  const [search, setSearch] = useState();
  const [hideEmployed, setHideEmployed] = useState(true);
  const [filterMenuOpened, setFilterMenuOpened] = useState(false);
  const [filters, setFilters] = useState(initializeFilters());
  const [numberOfResults, setNumberOfResults] = useState(0);

  useEffect(() => {
    UIkit.util.on(document, 'show', '#toggle-filter-menu', () => {
      event(TAGS.PAGE_GALERIE_AFFICHER_FILTRES_CLIC);
      setFilterMenuOpened(true);
    });
    UIkit.util.on(document, 'hide', '#toggle-filter-menu', () => {
      setFilterMenuOpened(false);
    });
  }, []);

  const resetFilters = () => {
    setFilters(initializeFilters());
  };

  const numberOfFilters = Object.values(filters).reduce(
    (acc, curr) => acc + curr.length,
    0
  );

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
            Voici les CV de tous les candidats de la promotion actuelle de
            LinkedOut.
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
            <GridNoSSR middle gap="small" eachWidths={['1-4@m', '3-4@m']}>
              <div
                className="uk-flex uk-flex-middle uk-flex-left"
                style={{
                  paddingTop: 5,
                  paddingBottom: 5,
                }}
              >
                <Button
                  style="text"
                  className="uk-margin-small-right"
                  toggle="target: #toggle-filter-menu;"
                >
                  Filtrer par &nbsp;
                  <IconNoSSR
                    style={{ width: 15, height: 15 }}
                    name={`filter${filterMenuOpened ? '' : '-empty'}`}
                  />
                </Button>
                {numberOfFilters > 0 && (
                  <div className="uk-text-meta uk-margin-small-left uk-text-italic">
                    {numberOfResults} résultat{numberOfResults !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
              {numberOfFilters > 0 && (
                <div className="uk-flex uk-flex-middle uk-flex-right">
                  <div className="uk-flex uk-flex-right uk-flex-wrap uk-flex-1">
                    {Object.values(filters)
                      .reduce((acc, curr) => {
                        return acc.concat(curr);
                      }, [])
                      .map((filter, index) => (
                        <div
                          key={filter.label + index}
                          className="uk-flex uk-flex-center uk-flex-middle"
                          style={{
                            paddingRight: 5,
                            paddingTop: 5,
                            paddingBottom: 5,
                          }}
                        >
                          <span className="uk-badge">{filter.label}</span>
                        </div>
                      ))}
                  </div>
                  <div className="uk-flex">
                    {' '}
                    &nbsp;
                    <ButtonIcon
                      ratio={0.9}
                      name="close"
                      onClick={resetFilters}
                    />
                  </div>
                </div>
              )}
            </GridNoSSR>
            <CVFiltersSideBar
              filters={filters}
              setFilters={setFilters}
              hideEmployed={hideEmployed}
              setHideEmployed={setHideEmployed}
            />
          </div>
        </div>
        <CVList
          search={search}
          filters={filters}
          updateNumberOfResults={setNumberOfResults}
          hideEmployed={hideEmployed}
        />
      </GridNoSSR>
    </Section>
  );
};
export default SearchCandidates;
