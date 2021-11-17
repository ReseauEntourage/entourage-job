import React from 'react';
import PropTypes from 'prop-types';
import { Img, Section } from 'src/components/utils';
import Carousel from 'src/components/utils/Carousel';
import CarouselItem from 'src/components/partials/CarouselItem';

const testimonies = [
  {
    image: '/static/img/temoignage-candidat-jordan.jpg',
    author: 'Jordan',
    quote:
      "C'est une équipe joyeuse, qui donne de la joie, l'envie de se battre jusqu'au bout. Les personnes que j'ai rencontré ne m'ont pas fait ressentir qu’on était différent.",
  },
  {
    image: '/static/img/temoignage-candidat-danny.jpg',
    author: 'Danny',
    quote:
      'J’ai découvert que je ne savais que j’ignorais des choses sur mon CV, on m’a appris à me découvrir. LinkedOut, c’est un GPS pour être humain ! Vous nous aidez à trouver notre chemin et à le construire sans pour autant le faire pour nous.',
  },
  {
    image: '/static/img/temoignage-candidat-amelie.jpg',
    author: 'Amélie',
    quote:
      "C'est vraiment un bon dispositif. Avec mon coach, on ne parle pas simplement du travail, il me donne des conseils. Ce sont des choses dont j'avais besoin, surtout que je n'ai pas de famille ici. J'ai parcouru beaucoup d'autres dispositifs et là c'est différent, LinkedOut est très présent.",
  },
  {
    image: '/static/img/temoignage-candidat-lamin.jpg',
    author: 'Lamin',
    quote:
      'C’est très organisé, je suis très satisfait. La vie est compliquée mais on peut avancer grâce à Linkedout.',
  },
];

const CandidateTestimoniesOrientation = ({ style }) => {
  return (
    <Section style={style} container="small">
      <h2 className="uk-text-bold uk-text-center">
        Les candidats <span className="uk-text-primary">témoignent</span>
      </h2>
      <div className="uk-flex uk-flex-center">
        <Carousel
          style="default"
          containerClasses="uk-container-small uk-child-width-1-1"
        >
          {testimonies.map(({ author, image, quote }, index) => {
            return (
              <CarouselItem
                key={index}
                index={index}
                img={image}
                description={
                  <div>
                    <Img
                      alt="guillemets"
                      width="27"
                      height="21"
                      src="/static/img/guillemets.png"
                    />
                    <p className="uk-text-small uk-margin-small uk-text-italic">
                      {quote}
                    </p>
                    <div
                      className="uk-text-bottom"
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <Img
                        alt="guillemets-petits"
                        width="15"
                        height="12"
                        src="/static/img/guillemetsPetits.png"
                      />
                    </div>
                    <p className="uk-text-bold uk-margin-small uk-margin-remove-bottom">
                      {author}
                    </p>
                  </div>
                }
              />
            );
          })}
        </Carousel>
      </div>
      <iframe
        src="https://www.youtube.com/embed/ztZB4BIBi44"
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

CandidateTestimoniesOrientation.propTypes = {
  style: PropTypes.oneOf(['muted', 'default']).isRequired,
};

export default CandidateTestimoniesOrientation;
