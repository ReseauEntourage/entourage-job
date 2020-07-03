import React from 'react';
import {IconNoSSR, Section} from '../utils';
import Layout from "../Layout";
import Carousel from "../utils/Carousel";
import Grid from "../utils/Grid";
import CarouselItem from "../partials/CarouselItem";

const Highlights = () => {
  const highlights = [
    {
      description: <div>Des personnes <span className="uk-text-bold">partagent votre CV sur leurs réseaux sociaux</span> pour que vous receviez des opportunités d’emploi</div>,
      img: '/static/img/highlight_1.jpg',
    },
    {
      description: <div><span className="uk-text-bold">Vous êtes soutenu(e) par un bénévole-coach</span> sur la durée, pendant la recherche et après la reprise d&apos;un emploi</div>,
      img: '/static/img/highlight_2.jpg',
    },
    {
      description: <div>Vous choisissez <span className="uk-text-bold">des formations courtes selon vos besoins</span> <span className="uk-text-italic">(numérique, préparation à l’entretien d&apos;embauche, connaissance de l’entreprise...)</span></div>,
      img: '/static/img/highlight_3.jpg',
    },
    {
      description: <div>Au sein de la communauté Entourage <span className="uk-text-bold">vous pouvez participer à des événements</span> de convivialité pour vous ressourcer et faire de nouvelles rencontres (soirées jeux, apéro, pétanque,…)</div>,
      img: '/static/img/highlight_4.jpg',
    },
    {
      description: <div>Vous bénéficiez <span className="uk-text-bold">d&apos;un réseau d&apos;anciens</span> pour des contacts ou des conseils si vous le souhaitez</div>,
      img: '/static/img/highlight_5.jpg',
    }
  ];

  return (
    <Section
      id="highlights"
      style='muted'
      container="small">
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
          Que vous apporte{' '}<span className="uk-text-primary">LinkedOut&nbsp;?</span>
        </h2>
        <h3 className="uk-align-center uk-text-center">
          LinkedOut vous aide à trouver un travail et à vous intégrer dans votre nouvelle entreprise
        </h3>
        <div className="uk-width-expand">
          <Carousel containerClasses="uk-child-width-1-1">
            {highlights.map(({img, description}, index) => <CarouselItem index={index} img={img} description={description} />)}
          </Carousel>
        </div>
      </div>
    </Section>
  );
};

Highlights.propTypes = {

};

Highlights.defaultProps = {
};

export default Highlights;
