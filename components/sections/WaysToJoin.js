import React from 'react';
import {Section} from '../utils';
import MultipleCTA from "../partials/MultipleCTA";
import HireCTA from "../partials/HireCTA";
import Carousel from "../utils/Carousel";
import Grid from "../utils/Grid";

const WaysToJoin = () => {
  const content = [
    {
      description: <div>En fin de parcours d’insertion, les candidats nous sont <span className="uk-text-bold">orientés par les chargées d’accompagnement</span> des structures d’insertion professionnelles</div>,
      img: '/static/img/highlight_3.jpg',
    },
    {
      description: <div>Les candidats sont <span className="uk-text-bold">orientés par les travailleurs sociaux d’associations partenaires</span> ou de dispositif publics</div>,
      img: '/static/img/highlight_1.jpg',
    },
    {
      description: <div>Les candidats sont orientés par <span className="uk-text-bold">des membres du réseau Entourage</span></div>,
      img: '/static/img/highlight_2.jpg',
    },
    {
      description: <div>Les candidats <span className="uk-text-bold">candidatent spontanément</span> depuis le site internet</div>,
      img: '/static/img/highlight_4.jpg',
    },
  ];

  return (
    <Section
      id="waysToJoin"
      style="muted">
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
          Plusieurs <span className="uk-text-primary">manières de rejoindre</span> LinkedOut
        </h2>
        <div className="uk-container-small uk-margin-large-bottom">
          <Carousel containerClasses="uk-child-width-1-1" itemRenderer={(({description, img}, index) => {
            return (
              <li key={index.toString()} className="uk-flex uk-flex-middle">
                <Grid
                  childWidths={[`1-2@m`]}
                  match
                  className="uk-padding-large uk-padding-remove-vertical uk-margin-medium-top">
                  <div className="uk-flex-1">
                    <img src={img} width="" height="" alt="" />
                  </div>
                  <div className="uk-flex uk-flex-1 uk-flex-center uk-flex-middle uk-padding-small">
                    {description}
                  </div>
                </Grid>
              </li>
            );
          })} items={content} />
        </div>
        <HireCTA />
      </div>
    </Section>
  );
};

WaysToJoin.propTypes = {

};

WaysToJoin.defaultProps = {
};

export default WaysToJoin;
