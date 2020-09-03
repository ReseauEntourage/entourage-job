import React, {useEffect, useState} from 'react';
import Layout from '../components/Layout';
import CVList from '../components/cv/CVList';
import {Button, GridNoSSR, IconNoSSR, Section} from '../components/utils';
import ButtonIcon from '../components/utils/ButtonIcon';
import {FILTERS_DATA} from "../constants";
import {getChildrenFilters} from "../utils";
import Icon from "../components/utils/Icon";

let debounceTimeoutId;

const initializeFilters = () => {
  return FILTERS_DATA.reduce((acc, curr) => {
    acc[curr.key] = [];
    return acc;
  }, {});
};

const Candidats = () => {
  const [search, setSearch] = useState();
  const [filterMenuOpened, setFilterMenuOpened] = useState(false);
  const [filters, setFilters] = useState(initializeFilters());
  const [numberOfResults, setNumberOfResults] = useState(0);
  const [showNumberOfResults, setShowNumberOfResults] = useState(false);

  const resetFilters = () => {
    setFilters(initializeFilters());
  };

  const renderFilters = (filterConstants, key) => {
    const reducedFilters = getChildrenFilters(filterConstants);

    return reducedFilters.map((filterConst, idx) => {

      const index = filters[key].findIndex((filter) => {
        return filter.value === filterConst.value;
      });

      const onFilterClick = () => {
        const updatedFilters = {...filters};
        if (index < 0) {
          updatedFilters[key].push(filterConst);
        } else {
          updatedFilters[key].splice(index, 1);
        }

        setFilters(updatedFilters);
      };

      const handleKeyDown = (ev) => {
        if (ev.key === "Enter") {
          onFilterClick();
        }
      };

      return (
        <div
          key={key + idx}
          className="uk-padding-small uk-padding-remove-bottom uk-padding-remove-right">
          <div
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className={`ent-filter${index < 0 ? '' : '-activated'}`}
            onClick={onFilterClick}>{filterConst.label}</div>
        </div>
      )
    })
  };

  const numberOfFilters = Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);

  useEffect(() => {
    if (numberOfFilters > 0) {
      setShowNumberOfResults(true);
    } else {
      setShowNumberOfResults(false);
    }
  }, [numberOfResults]);

  const startSearch = (event) => {
    if (event.target.value) {
      setSearch(event.target.value);
    } else {
      setSearch(null);
    }
  };

  return (
    <Layout title="Les candidats - LinkedOut">
      <Section style="default">
        <GridNoSSR
          gap="large"
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
          <div className="uk-flex uk-flex-column uk-flex-middle">
            <div
              style={{maxWidth: 1000}}
              className="uk-width-expand ent-search-bar">
              <form className="uk-search uk-search-navbar uk-width-expand uk-background-muted">
                <input
                  className="uk-search-input"
                  type="search"
                  placeholder="Taper un mot-clé ou un terme pour affiner votre recherche..."
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter") {
                      ev.preventDefault();
                    }
                  }}
                  onChange={(event) => {
                    clearTimeout(debounceTimeoutId);
                    event.persist();
                    debounceTimeoutId = setTimeout(() => startSearch(event), 500);
                  }}
                />
              </form>
              <div className="ent-search-icon uk-background-primary uk-light">
                <Icon name="search" className="uk-text-secondary" />
              </div>
            </div>

            <div
              style={{maxWidth: 1100}}
              className="uk-width-expand uk-padding-small uk-padding-remove-vertical uk-flex uk-flex-column uk-margin-medium-top">
              <GridNoSSR
                middle
                gap='small'
                eachWidths={['1-4@m', '3-4@m']}
              >
                <div
                  className="uk-flex uk-flex-middle uk-flex-left" style={{
                  paddingTop: 5,
                  paddingBottom: 5
                }}>
                  <Button
                    style="text"
                    toggle="target: #toggle-animation; animation: uk-animation-fade"
                    onClick={() => {
                      setFilterMenuOpened(!filterMenuOpened);
                    }}>
                    Filtrer par{' '}&nbsp;<IconNoSSR
                    ratio={1.2}
                    name={`chevron-${filterMenuOpened ? 'up' : 'down'}`} />
                  </Button>
                  {
                    showNumberOfResults && numberOfFilters > 0 &&
                    <div className="uk-text-meta uk-margin-small-left uk-text-italic">
                      {numberOfResults} résultat{numberOfResults !== 1 ? 's' : ''}
                    </div>
                  }
                </div>
                {
                  numberOfFilters > 0 &&
                  <div className="uk-flex uk-flex-middle uk-flex-right">
                    <div className="uk-flex uk-flex-right uk-flex-wrap uk-flex-1">
                      {
                        Object.values(filters).reduce((acc, curr) => {
                          return acc.concat(curr);
                        }, []).map((filter, index) =>
                          <div
                            key={filter.label + index}
                            className="uk-flex uk-flex-center uk-flex-middle"
                            style={{
                              paddingRight: 5,
                              paddingTop: 5,
                              paddingBottom: 5
                            }}>
                            <span className="uk-badge">{filter.label}</span>
                          </div>
                        )
                      }
                    </div>
                    <div className="uk-flex">
                      {' '}&nbsp;
                      <ButtonIcon
                        ratio={0.9}
                        name='close'
                        onClick={resetFilters} />
                    </div>
                  </div>
                }
              </GridNoSSR>

              <div id="toggle-animation" hidden className="uk-margin-medium-top">
                {
                  FILTERS_DATA.map(({title, constants, key}) => {
                    return (
                      <div key={key}>
                        <span className="uk-text-bold">{title}</span>
                        <div className="uk-flex uk-flex-wrap uk-margin-medium-bottom">
                          {renderFilters(constants, key)}
                        </div>
                      </div>
                    )
                  })
                }
                <div className="uk-flex uk-flex-center uk-margin-medium-top">
                  <Button
                    style="text"
                    toggle="target: #toggle-animation; animation: uk-animation-fade"
                    onClick={() => {
                      setFilterMenuOpened(!filterMenuOpened);
                    }}>
                    Fermer la liste{' '}&nbsp;
                    <IconNoSSR ratio={1.2} name='chevron-up' />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <CVList
            search={search}
            filters={filters}
            updateNumberOfResults={setNumberOfResults} />
        </GridNoSSR>
      </Section>
    </Layout>
  );
};
export default Candidats;