import React from 'react';
import { ImgNoSSR, Section } from '../utils';
import Carousel from '../utils/Carousel';
import CarouselItem from '../partials/CarouselItem';

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
      "C'est vraiment un bon dispositif. Nous ne sommes pas tout seul. Avec ma Coach, on ne parle pas simplement du travail, elle me donne des conseils. Je n’ai pas de famille ici, c'est des choses dont j'avais besoin. J'ai parcouru beaucoup les missions locales et d'autres dispositif et là c'est différent, vous êtes là.",
  },
  {
    image: '/static/img/temoignage-candidat-lamin.jpg',
    author: 'Lamin',
    quote:
      'C’est très organisé, je suis très satisfait. La vie est compliquée mais on peut avancer grâce à Linkedout.',
  },
];

const CandidateTestimoniesOrientation = () => {
  return (
    <Section style="muted" container="small">
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
                    <ImgNoSSR
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
                      <ImgNoSSR
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
    </Section>
  );
};

export default CandidateTestimoniesOrientation;
