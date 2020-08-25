import React from 'react';
import {Section} from '../utils';
import HireCTA from "../partials/HireCTA";
import Carousel from "../utils/Carousel";
import CarouselItem from "../partials/CarouselItem";

const WaysToJoin = () => {
  const content = [
    {
      description: <div>En fin de parcours d’insertion, les candidats nous sont <span className="uk-text-bold">orientés par les chargées d’accompagnement</span> des structures d’insertion professionnelles</div>,
      img: '/static/img/way_1.jpg',
    },
    {
      description: <div>Les candidats sont <span className="uk-text-bold">orientés par les travailleurs sociaux d’associations partenaires</span> ou de dispositif publics</div>,
      img: '/static/img/way_2.jpg',
    },
    {
      description: <div>Les candidats sont orientés par <span className="uk-text-bold">des membres du réseau Entourage</span></div>,
      img: '/static/img/way_3.jpg',
    },
    {
      description: <div>Les candidats <span className="uk-text-bold">candidatent spontanément</span> depuis le site internet</div>,
      img: '/static/img/way_4.jpg',
    },
  ];

  return (
    <Section
      id="waysToJoin"
      style="muted">
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <div className="uk-width-expand">
          <div className="uk-container-small uk-margin-auto">
            <Carousel containerClasses="uk-child-width-1-1">
              {content.map(({img, description}, index) => <CarouselItem key={index} index={index} img={img} description={description} />)}
            </Carousel>
          </div>
        </div>
      </div>
    </Section>
  );
};

WaysToJoin.propTypes = {

};

WaysToJoin.defaultProps = {
};

export default WaysToJoin;
