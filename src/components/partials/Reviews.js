import React from 'react';
import { Img, Section } from 'src/components/utils';
import Carousel from 'src/components/utils/Carousel';
import CarouselItem from 'src/components/partials/CarouselItem';

const reviews = [
  {
    image: '/static/img/temoignage-entreprise-augustin-kenny.jpg',
    author: 'Augustin Chavanne',
    company: 'Vélissime',
    industry: 'livraison de repas',
    companyInfo: '20 salariés',
    review:
      'Kenny est un vrai bonhomme, pas un jeune diplômé fraîchement moulu qui nous parle de choses qu’il n’a pas vécues. Par son expérience, il apporte quelque chose de radicalement différent. Si je pouvais embaucher 2 Kenny, je le ferais !',
  },
  {
    image: '/static/img/temoignage-entreprise-francois-miah.jpg',
    author: 'François Biard',
    company: 'Green Factory',
    industry: 'créations végétales',
    companyInfo: '31 salariés',
    review:
      'Avec Miah c’est une réussite. Là où notre compétence s’arrête, on est rassurés par le fait que LinkedOut est là pour nous accompagner. Si on peut s’inscrire dans des actions comme celles-ci tout en gardant notre efficacité, en y ajoutant le sourire de quelqu’un qui a envie, on le fait !',
  },
  {
    image: '/static/img/temoignage-entreprise-advens.jpg',
    author: 'Sylvie Lepoutre',
    company: 'Advens',
    industry: 'cybersécurité',
    companyInfo: '200 salariés',
    review:
      'Nous étions à mille lieux des problématiques des personnes en précarité. Maintenant, chez Advens, on entend des mots comme “résilience”, “deuxième chance”, “rebond”, “inclusion”. Les collaborateurs sont très fiers !',
  },
  {
    image: '/static/img/temoignage-entreprise-mcdo.jpg',
    author: 'Arnaud Héry',
    company: "Ex-directeur de la formation chez McDonald's",
    industry: 'restauration',
    companyInfo: '70 000 salariés en France',
    review:
      'Ce qu’il y a de plus important pour un employeur, c’est de voir la lumière qui brille dans les yeux de la personne en face, qui traduit l’envie d’apprendre et de s’en sortir.',
  },
];

const Reviews = () => {
  return (
    <Section id="reviews" style="default">
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
        <span className="uk-text-primary">Les recruteurs</span> témoignent
      </h2>
      <div className="uk-flex uk-flex-center">
        <Carousel
          style="default"
          containerClasses="uk-child-width-1-1 uk-container-small"
        >
          {reviews.map(
            (
              { author, company, industry, companyInfo, review, image },
              index
            ) => {
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
                        {review}
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
                      <p className="uk-text-meta uk-margin-remove">
                        <span className="uk-text-bold">{company}</span>,&nbsp;
                        <span>{industry}</span>
                        {companyInfo && <span>,&nbsp;{companyInfo}</span>}
                      </p>
                    </div>
                  }
                />
              );
            }
          )}
        </Carousel>
      </div>
    </Section>
  );
};

export default Reviews;
