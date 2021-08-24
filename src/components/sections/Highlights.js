import React from 'react';
import Carousel from 'src/components/utils/Carousel';
import CarouselItem from 'src/components/partials/CarouselItem';
import { Section, SimpleLink } from 'src/components/utils';

const Highlights = () => {
  const highlights = [
    {
      description: (
        <div>
          <span className="uk-text-bold">Un coach LinkedOut</span> qui vous
          soutient à chaque étape de votre recherche d’emploi et pendant votre
          intégration en entreprise (1 rencontre&nbsp;/&nbsp;semaine)
        </div>
      ),
      img: '/static/img/header_pic_guide.jpg',
    },
    {
      description: (
        <div>
          <span className="uk-text-bold">Une nouvelle forme de CV</span> qui met
          l’accent sur l’humain, qui valorise votre parcours et vos qualités.
        </div>
      ),
      img: '/static/img/orientation_3.jpg',
    },
    {
      description: (
        <div>
          <span className="uk-text-bold">
            Un site internet <SimpleLink href="/">www.linkedout.fr</SimpleLink>
          </span>{' '}
          qui permet de partager votre CV à grande échelle sur les réseaux
          sociaux pour rendre visible votre profil.
        </div>
      ),
      img: '/static/img/orientation_2.jpg',
    },
    {
      description: (
        <div>
          <span className="uk-text-bold">
            Des moments partagés avec les autres candidats
          </span>{' '}
          pour prendre confiance en soi, se motiver à plusieurs et vivre des
          expériences marquantes.
        </div>
      ),
      img: '/static/img/orientation_4.jpg',
    },
  ];

  return (
    <Section id="highlights" style="default" container="small">
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
          Que vous apporte{' '}
          <span className="uk-text-primary">LinkedOut&nbsp;?</span>
        </h2>
        <div className="uk-width-expand">
          <Carousel containerClasses="uk-child-width-1-1">
            {highlights.map(({ img, description }, index) => {
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
      <iframe
        src="https://www.youtube.com/embed/9TK4wOfF-HU?start=61"
        width="1280"
        height="720"
        frameBorder="0"
        allowFullScreen
        data-uk-responsive
        data-uk-video="automute: false; autoplay: false"
        title="linkedout"
        className="uk-margin-medium-top"
      />
    </Section>
  );
};

Highlights.propTypes = {};

Highlights.defaultProps = {};

export default Highlights;
