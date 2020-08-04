import React, { useState } from 'react';
import Layout from '../components/Layout';
import CVList from '../components/cv/CVList';
import {Section, GridNoSSR, IconNoSSR, Button} from '../components/utils';
import ButtonIcon from '../components/utils/ButtonIcon';
import {BUSINESS_LINES, LOCATIONS} from "../constants";

const LesCandidats = () => {
  const [search, setSearch] = useState();
  const [filterMenuOpened, setFilterMenuOpened] = useState(false);
  const [filters, setFilters] = useState({businessLines: [], locations: []});

  const resetFilters = () => {
    setFilters({businessLines: [], locations: []});
  };

  const renderFilters = (filterConstants, key) => {
    return filterConstants.map((filterConst, idx) => {

      const index = filters[key].findIndex((filter) => {
        return filter.value === filterConst.value;
      });

      const onFilterClick = () => {
        const updatedFilters = {...filters};
        if(index < 0) {
          updatedFilters[key].push(filterConst);
        }
        else {
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
        <div key={idx} className="uk-padding-small uk-padding-remove-bottom uk-padding-remove-right">
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

  const getNumberFilters = () => {
    return Object.values(filters).reduce((acc, curr) => {
      return acc + curr.length;
    }, 0)
  };

  return (
    <Layout title="Les candidats - LinkedOut">
      <Section style="default">
        <GridNoSSR
          gap="medium"
          column
          middle
          eachWidths={['2-3@s', '1-1', '1-1', '1-1']}
        >
          <div className="uk-text-center uk-margin-medium-bottom">
            <h2 className="uk-text-bold">
              Découvrez les <span className="uk-text-primary">Candidats</span>
            </h2>
            <p>
              Voici les CV de tous les candidats de la promotion actuelle de
              LinkedOut.
            </p>
          </div>

          <nav className="uk-navbar-container" data-uk-navbar>
            <div className="uk-navbar-left uk-navbar-item uk-width-1-1">
              <form className="uk-search uk-search-navbar uk-width-1-1">
                <span data-uk-search-icon />
                <input
                  className="uk-search-input"
                  type="search"
                  placeholder="Search..."
                  onChange={(event) => {
                    if (event.target.value) {
                      setSearch(event.target.value);
                    } else {
                      setSearch(null);
                    }
                  }}
                />
              </form>
            </div>
          </nav>
          <div className="uk-margin-large-left uk-margin-large-right uk-flex uk-flex-column uk-margin-small-bottom uk-margin-small-top">
            <GridNoSSR
              middle
              gap='small'
              eachWidths={['1-4@m', '3-4@m']}
            >
              <div className="uk-flex uk-flex-middle uk-flex-left" style={{
                paddingTop: 5,
                paddingBottom: 5
              }}>
                <Button
                  style="text"
                  toggle="target: #toggle-animation; animation: uk-animation-fade"
                  onClick={() => {
                    setFilterMenuOpened(!filterMenuOpened);
                  }}>
                  Filtrer par{' '}&nbsp;<IconNoSSR ratio={1.2} name={`chevron-${filterMenuOpened ? 'up' : 'down'}`} />
                </Button>
              </div>
              {
                getNumberFilters() > 0 &&
                <div className="uk-flex uk-flex-middle uk-flex-right">
                  <div className="uk-flex uk-flex-right uk-flex-wrap uk-flex-1">
                    {
                      filters.businessLines.map((filter) =>
                        <div className="uk-flex uk-flex-center uk-flex-middle" style={{
                          paddingRight: 5,
                          paddingTop: 5,
                          paddingBottom: 5
                        }}>
                          <span className="uk-badge">{filter.label}</span>
                        </div>
                      )
                    }
                  </div>
                  <div className="uk-margin-small-left">
                    <ButtonIcon
                      ratio={0.9}
                      name='close'
                      onClick={resetFilters} />
                  </div>
                </div>
              }
            </GridNoSSR>

            <div id="toggle-animation" hidden className="uk-margin-medium-top">
              <span className="uk-text-bold">Secteurs d&apos;activité</span>
              <div className="uk-flex uk-flex-wrap uk-margin-medium-bottom">
                {renderFilters(BUSINESS_LINES, 'businessLines')}
              </div>
              <span className="uk-text-bold">Zones géographiques</span>
              <div className="uk-flex uk-flex-wrap">
                {renderFilters(LOCATIONS, 'locations')}
              </div>
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
          <CVList nb={10000} search={search} filters={filters}/>
        </GridNoSSR>
      </Section>
    </Layout>
  );
};
export default LesCandidats;
