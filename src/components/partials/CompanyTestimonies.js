import React from 'react';
import { Img, Section } from 'src/components/utils';
import Carousel from 'src/components/utils/Carousel';
import CarouselItem from 'src/components/partials/CarouselItem';

const testimonies = [
  {
    image: '/static/img/temoignage-entreprise-alexandre-fayeulle.jpg',
    author: 'Alexandre Fayeulle',
    company: "Président d'Advens",
    quote:
      'La performance sociétale doit prendre le pas sur la performance financière. Je souhaite qu’Advens incarne cette nouvelle génération d’entreprises qui contribue à transformer l’économie. Le mouvement semble en marche, et la crise que nous traversons nous offre l’opportunité de l’accélérer !',
  },
  {
    image: '/static/img/temoignage-entreprise-randstad.jpg',
    author: 'Ana de Boa Esperanca',
    company: "Responsable de l'Institut Randstad",
    quote:
      'L’inclusion, c’est permettre à tout individu de prendre toute la place qu’il mérite dans la société. C’est l’aider à prendre pleine conscience de ses droits et devoirs. L’inclusion c’est un tout, dans lequel s’imbriquent le volet économique, social, professionnel et citoyen. C’est redonner de la dignité aux êtres !',
  },
  {
    image: '/static/img/temoignage-entreprise-cadet.jpg',
    author: 'Patrick Wong',
    company: 'Directeur chez LeCADET Traiteur',
    quote:
      "Les salariés recrutés avec Emmaüs Défi sont très importants dans mon entreprise. Ils sont formés et opérationnels et je n'ai aucune envie de les voir partir !",
  },
  {
    image: '/static/img/temoignage-entreprise-green-factory.jpg',
    author: 'François Biard',
    company: 'Manager chez Green Factory',
    quote:
      'Même dans une équipe de 10 personnes, l’inclusion, ça marche. Les histoires de vie, les différents parcours, qu’ils soient chaotiques, difficiles…. créent de la richesse dans le collectif. C’est ce que nous trouvé avec Miah. Ca diffuse quelque chose de très positif, ça crée de la cohésion d’équipe et ça transforme.',
  },
  {
    image: '/static/img/temoignage-entreprise-thibault.jpg',
    author: 'Thibault Guilluy',
    company:
      'Haut Commissaire à l’inclusion par l’emploi et à l’engagement des entreprises',
    quote:
      'Un système qui oublie les plus fragiles est un système faible pour tous, peu résilient et qui peut s’effondrer à la moindre crise. Nous ne pourrons pas repartir comme avant.',
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
          {testimonies.map(({ author, company, quote, image }, index) => {
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
                    <p className="uk-text-meta uk-margin-remove uk-text-bold">
                      {company}
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

export default CompanyTestimonies;
