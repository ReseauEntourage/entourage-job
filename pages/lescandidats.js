import React, { useState } from 'react';
import Layout from '../components/Layout';
import {
  LandingPagePartial,
  EmphasePartial,
  CandidatListPartial,
  NumberPartial,
} from '../components/partials';
import Header from '../components/headers/Header';
import CVList from '../components/cv/CVList';
import {Section, GridNoSSR, IconNoSSR, Button} from '../components/utils';
import {BUSINESS_LINES} from "../constants";

const LesCandidats = () => {
  const [search, setSearch] = useState();
  const [filterMenuOpened, setFilterMenuOpened] = useState(false);
  const [filters, setFilters] = useState({
    businessLines: []
  });

  return (
    <Layout title="Les candidats - LinkedOut">
      <Section style="default">
        <GridNoSSR
          gap="large"
          column
          middle
          eachWidths={['2-3@s', '1-1', '1-1', '1-1']}
        >
          <div className="uk-text-center">
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
          <div className="uk-margin-large-left uk-margin-large-right uk-flex uk-flex-middle uk-flex-column">
            <Button
              style="text"
              className="uk-margin-medium-bottom"
              toggle="target: #toggle-animation; animation: uk-animation-fade"
              onClick={() => {
                setFilterMenuOpened(!filterMenuOpened);
              }}>
              Filtrer par{' '}&nbsp;<IconNoSSR ratio={1.2} name={`chevron-${filterMenuOpened ? 'up' : 'down'}`} />
            </Button>
            <div id="toggle-animation" hidden className="">
              <span className="uk-text-bold">Secteurs d&apos;activité</span>
              <div className="uk-flex uk-flex-wrap">
                {
                  BUSINESS_LINES.map((businessLine, idx) => {

                    const index = filters.businessLines.findIndex((business) => {
                      return business.value.includes(businessLine.value);
                    });

                    return (
                      <div key={idx} className="uk-user uk-padding-small uk-padding-remove-bottom uk-padding-remove-right">
                        <div
                          className={`ent-filter${index < 0 ? '' : '-activated'} uk-`}
                          onClick={() => {
                            const updatedFilters = {...filters};
                            if(index < 0) {
                              updatedFilters.businessLines.push(businessLine);
                            }
                            else {
                              updatedFilters.businessLines.splice(index, 1);
                            }
                            setFilters(updatedFilters);

                          }}>{businessLine.label}</div>
                      </div>
                    )
                  })
                }
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
