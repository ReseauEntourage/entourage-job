import React from 'react';
import { ImgNoSSR, Section } from '../utils';
import Carousel from '../utils/Carousel';
import CarouselItem from '../partials/CarouselItem';

const testimonies = [
  {
    image: '/static/img/temoignage-entreprise-alexandre-fayeulle.jpg',
    author: 'Alexandre Fayeulle',
    company: 'Advens, Président',
    quote:
      'La performance sociétale doit prendre le pas sur la performance financière. Je souhaite qu’Advens incarne cette nouvelle génération d’entreprises qui contribue à transformer l’économie pour la mettre au service du bien commun. Le mouvement semble en marche, et la crise que nous traversons nous offre l’opportunité de l’accélérer !',
  },
  {
    image: '/static/img/temoignage-entreprise-randstad.png',
    author: 'Laurent Morestain',
    company: 'ex-Secrétaire Général Randstad',
    quote:
      'L’inclusion, c’est permettre à tout individu de prendre toute la place qu’il mérite dans la société. C’est l’aider à prendre pleine conscience de ses droits et devoirs. L’inclusion c’est un tout, dans lequel s’imbriquent le volet économique, social, professionnel et citoyen. C’est redonner de la dignité aux êtres !',
  },
  {
    image: '/static/img/highlight_1.jpg',
    author: 'Patrick Wong',
    quote:
      "Les salariés recrutés avec Emmaüs Défi sont très importants dans mon entreprise. Ils sont formés et opérationnels et je n'ai aucune envie de les voir partir !",
  },
];

const CompanyTestimonies = () => {
  return (
    <Section id="company-testimonies" style="muted">
      <div className="uk-flex uk-flex-center">
        <Carousel
          style="default"
          containerClasses="uk-child-width-1-1 uk-container-small"
        >
          {testimonies.map(({ author, company, quote, image }, index) => (
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
                  <p className="uk-text-meta uk-margin-remove uk-text-bold">
                    {company}
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

export default CompanyTestimonies;
