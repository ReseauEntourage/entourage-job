import React from 'react';
import { ImgNoSSR, Section } from '../utils';
import Carousel from '../utils/Carousel';
import CarouselItem from '../partials/CarouselItem';

const testimonies = [
  {
    image: '/static/img/temoignage-candidat-laith.jpg',
    author: 'Laith',
    quote:
      "L'inclusion c’est d’être tous égaux et pas oublier les faibles à côté. LinkedOut m’a permis d’avoir un emploi stable et rentrer dans la société. Avoir un réseau vers qui me tourner. Avoir un emploi pour moi c’est signification d’être utile dans la société.",
  },
  {
    image: '/static/img/temoignage-candidat-kenny.jpg',
    author: 'Kenny',
    quote:
      'Avec un emploi, j’ai retrouvé ma dignité tout simplement ! Une dignité qu’on laisse dans la rue. Maintenant je n’attends qu’une chose : pouvoir moi aussi payer des impôts !',
  },
  {
    image: '/static/img/temoignage-candidat-ross.jpg',
    author: 'Ross',
    quote:
      'Travailler, c’est une question de respect pour soi-même, je préfère gagner ma vie plutôt qu’être dépendant de la générosité des autres.',
  },
];

const CandidateTestimonies = () => {
  return (
    <Section style="default" container="small">
      <h2 className="uk-text-bold uk-text-center">
        Un emploi, <span className="uk-text-primary">ça change une vie</span>
      </h2>
      <p className="uk-text-center">
        Jeunes issus de l’aide sociale à l’enfance, réfugiés nouvellement
        arrivés, accidentés de la vie, familles très précaires… tous ont en
        commun de n’avoir que très peu de gens sur qui compter. Beaucoup ont
        aussi des compétences, du talent, et l’envie de s’en sortir.
      </p>
      <p className="uk-text-center uk-margin-large-bottom">
        Aujourd’hui,&nbsp;
        <span className="uk-text-primary uk-text-bold">
          2 millions de personnes sont exclues du marché de l’emploi et vivent
          dans une grande précarité
        </span>
        . Pourtant, loin d’être assistés, ils rêvent de travailler !
      </p>
      <div className="uk-flex uk-flex-center">
        <Carousel
          style="default"
          containerClasses="uk-child-width-1-1 uk-container-small"
        >
          {testimonies.map(({ author, image, quote }, index) => (
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
          ))}
        </Carousel>
      </div>
    </Section>
  );
};

export default CandidateTestimonies;
