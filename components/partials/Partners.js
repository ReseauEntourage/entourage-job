import React from 'react';
import {Background, IconNoSSR, Section} from '../utils';
import Grid from "../utils/Grid";
import PARTNERS from '../../constants/partners';
import SimpleLink from "../utils/SimpleLink";

const Partners = () => {
  return (
    <Background blend={{colorHex: '#484848'}}>
      <Section container="large">
        <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
          <h2
            style={{color: '#fff'}}
            className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
            <span className="uk-text-primary">Les partenaires</span> du projet LinkedOut
          </h2>
          <div className="uk-background-default uk-padding-large">
            <h4
              className="uk-text-primary uk-text-bold">
              Ce projet est développé en partenariat avec
            </h4>
            <Grid
              childWidths={[`1-${PARTNERS.strategy.length}@m`]}
              match
              middle
              items={PARTNERS.strategy.map(({key}, index) => {
                return (
                  <div className="uk-width-small uk-flex uk-flex-center">
                    <img src={`/static/img/partners/${key}/logo.png`} style={{maxHeight: 100}} width="" height="" alt="" />
                  </div>
                );
              })}
            />
            <h4
              className="uk-text-primary uk-text-bold uk-margin-large-top">
              Avec le soutien précieux de
            </h4>
            <Grid
              childWidths={[`1-${PARTNERS.finance.length}@m`]}
              match
              middle
              items={PARTNERS.finance.map(({key}, index) => {
                return (
                  <div className="uk-width-small uk-flex uk-flex-center">
                    <img src={`/static/img/partners/${key}/logo.png`} style={{maxHeight: 100}} width="" height="" alt="" />
                  </div>
                );
              })}
            />
            <div className="uk-flex uk-flex-center uk-flex-middle uk-margin-large-top">
              <SimpleLink href="/lespartenaires">
                En savoir plus{' '}<IconNoSSR name="arrow-right" />
              </SimpleLink>
            </div>

          </div>
        </div>
      </Section>
    </Background>
  )
};

export default Partners;
