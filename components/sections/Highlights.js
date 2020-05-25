import React from 'react';
import {IconNoSSR, Section} from '../utils';
import Layout from "../Layout";
import Carousel from "../utils/Carousel";

const Highlights = () => {
  const highlights = [
    {
      description: <div>Des personnes <span className="uk-text-bold">partagent votre CV sur leurs réseaux sociaux</span> pour que vous receviez des opportunités d’emploi</div>,
      img: '/static/img/highlight_1.jpg',
    },
    {
      description: <div><span className="uk-text-bold">Vous êtes soutenu par un bénévole-coach</span> sur la durée, pendant la recherche et après la reprise d&apos;un emploi</div>,
      img: '/static/img/highlight_1.jpg',
    },
    {
      description: <div>Vous choisissez <span className="uk-text-bold">des formations courtes selon vos besoins</span> (numérique, préparation à l’entretien d&apos;embauche, connaissance de l’entreprise...)</div>,
      img: '/static/img/highlight_1.jpg',
    },
    {
      description: <div>Au sein de la communauté Entourage <span className="uk-text-bold">vous pouvez participer à des événements</span> de convivialité pour vous ressourcer et faire de nouvelles rencontres (soirées jeux, apéro, théâtre,…)</div>,
      img: '/static/img/highlight_1.jpg',
    },
    {
      description: <div><span className="uk-text-bold">Un réseau d&apos;ancien</span> pour des contacts ou des conseils si vous le souhaitez</div>,
      img: '/static/img/highlight_1.jpg',
    }
  ];

  return (
    <Section style='muted' id="highlights" container="small">
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-vertical">
          Que vous apporte{' '}<span className="uk-text-primary">LinkedOut&nbsp;?</span>
        </h2>
        <h3 className="uk-width-1-2@m uk-align-center uk-text-center">
          LinkedOut vous aide à trouver un travail et à vous intégrer dans votre nouvelle entreprise
        </h3>
        <div className="uk-height-large uk-width-expand">
          <Carousel containerClasses="uk-child-width-1-1" itemRenderer={(({description, img}, index) => {
            return (
              <li>
                <div className="uk-inline uk-flex uk-padding-large uk-padding-remove-vertical uk-flex-center uk-flex-wrap uk-flex-wrap-around uk-margin-medium-top">
                  <div className="uk-inline">
                    <img src={img} className="uk-flex-1 uk-width-large uk-padding-small"  alt="" />
                    <div className="uk-position-bottom uk-text-primary uk-text-bold" style={{marginLeft: -10, fontSize: '90px', lineHeight: '90px'}}>{index + 1}</div>
                  </div>
                  <div className="uk-flex uk-flex-1 uk-flex-center uk-flex-middle uk-padding-small">
                    {description}
                  </div>
                </div>
              </li>
            );
          })} items={highlights} />
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
