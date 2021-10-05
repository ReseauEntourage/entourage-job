import React from 'react';
import { Section, SimpleLink } from 'src/components/utils';
import Carousel from 'src/components/utils/Carousel';
import CarouselItem from 'src/components/partials/CarouselItem';

const WhatItBringsToCandidates = () => {
  const content = [
    {
      description: (
        <div>
          <span className="uk-text-bold">Un coach LinkedOut</span> qui soutient
          le candidat à chaque étape de sa recherche d’emploi et dans son
          intégration en entreprise
        </div>
      ),
      img: '/static/img/orientation_1.jpg',
    },
    {
      description: (
        <div>
          <span className="uk-text-bold">Une nouvelle forme de CV</span> qui met
          l’accent sur l’humain et qui valorise le parcours et les qualités de
          la personne.
        </div>
      ),
      img: '/static/img/orientation_3.jpg',
    },
    {
      description: (
        <div>
          <span className="uk-text-bold">
            Le site internet <SimpleLink href="/">www.linkedout.fr</SimpleLink>
          </span>{' '}
          qui permet de partager ces CV à grande échelle sur les réseaux sociaux
          pour générer des opportunités d’emploi et permettre aux entreprises
          d’envoyer leurs offres
        </div>
      ),
      img: '/static/img/orientation_2.jpg',
    },
    {
      description: (
        <div>
          <span className="uk-text-bold">
            Des événements de convivialité et de remobilisation collectifs
          </span>
          , qui s’appuient sur la communauté Entourage et des formations courtes
          à la carte en lien avec nos partenaires.
        </div>
      ),
      img: '/static/img/orientation_4.jpg',
    },
  ];

  return (
    <Section id="whatItBringsCandidates" style="default" container="small">
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
          Ce qu&apos;apporte{' '}
          <span className="uk-text-primary">LinkedOut&nbsp;?</span>
        </h2>
        <div className="uk-width-expand">
          <Carousel containerClasses="uk-child-width-1-1">
            {content.map(({ img, description }, index) => {
              return (
                <CarouselItem
                  key={index}
                  index={index}
                  img={img}
                  description={description}
                />
              );
            })}
          </Carousel>
        </div>
      </div>
    </Section>
  );
};

WhatItBringsToCandidates.propTypes = {};

WhatItBringsToCandidates.defaultProps = {};

export default WhatItBringsToCandidates;
