import React from 'react';
import {Background, Section} from '../utils';
import Grid from "../utils/Grid";

const Partenaires = () => {
  const partners = {
    strategy: [
      '../../static/img/partner10.png',
      '../../static/img/partner2.png',
      '../../static/img/partner5.png',
      '../../static/img/partner6.png',
      '../../static/img/partner3.png',
      '../../static/img/partner11.png',
    ],
    finance: [
      '../../static/img/partner7.png',
      '../../static/img/partner4.png',
      '../../static/img/partner9.png',
      '../../static/img/partner8.png',
      '../../static/img/partner1.png',
    ]
  };

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
              childWidths={[`1-${partners.strategy.length}@m`]}
              match
              middle
              items={partners.strategy.map((img, index) => {
                return (
                  <div className="uk-width-small">
                    <img src={img} width="" height="" alt="" />
                  </div>
                );
              })}
            />
            <h4
              className="uk-text-primary uk-text-bold uk-margin-large-top">
              Avec le soutien précieux de
            </h4>
            <Grid
              childWidths={[`1-${partners.finance.length}@m`]}
              match
              middle
              items={partners.finance.map((img, index) => {
                return (
                  <div className="uk-width-small">
                    <img src={img} width="" height="" alt="" />
                  </div>
                );
              })}
            />
          </div>
        </div>
      </Section>
    </Background>
  )
};

export default Partenaires;
