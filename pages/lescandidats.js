import React, { useState } from 'react';
import Layout from '../components/Layout';
import {
  LandingPagePartial,
  EmphasePartial,
  CandidatListPartial,
  DifferencePartial,
  NumberPartial,
} from '../components/partials';
import Header from '../components/headers/Header';
import CVList from '../components/cv/CVList';
import { Section, GridNoSSR } from '../components/utils';

const LesCandidats = () => {
  const [search, setSearch] = useState();

  return (
    <Layout title="Les candidats - LinkedOut">
      <Section style="default">
        <GridNoSSR
          gap="large"
          column
          middle
          eachWidths={['2-3@s', '1-1', '1-1']}
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
          <CVList nb={10000} search={search} />
        </GridNoSSR>
      </Section>
    </Layout>
  );
};
export default LesCandidats;
