import React from 'react';
import { ImgNoSSR, Section } from '../utils';
import Carousel from '../utils/Carousel';
import CarouselItem from '../partials/CarouselItem';

const reviews = [
  {
    image: '/static/img/temoignage-candidat-kenny.jpg',
    author: 'Augustin Chavanne',
    company: 'Vélissime',
    industry: 'livraison de repas',
    companyInfo: '20 salariés',
    review:
      'Dès l’entretien d’embauche, Kenny dénotait par son enthousiasme, son énergie et l’expérience qu’il avait vécue. Un vrai bonhomme, pas simplement un gars diplômé, fraîchement moulu, qui nous parle de choses qu’il n’a pas vécues. Par son expérience, il apporte quelque chose de radicalement différent. Si je pouvais embaucher 2 Kenny, je le ferais !',
  },
  {
    image: '/static/img/temoignage-entreprise-miah.png',
    author: 'François Biard',
    company: 'Green Factory',
    industry: 'créations végétales',
    review:
      'Avec Miah c’était une réussite. Nous avons eu un cas moins positif mais nous avons alerté l’équipe LinkedOut qui tout de suite pris le sujet en main. Là où notre compétence s’arrête, on est rassurés par le fait que LinkedOut est là pour nous accompagner. Si on peut s’inscrire dans des actions comme celles-ci tout en gardant notre efficacité, en y ajoutant le sourire de quelqu’un de joyeux et qui a envie, je veux le faire !',
  },
  {
    image: '/static/img/temoignage-candidat-laith.jpg',
    author: 'Sylvie Lepoutre',
    company: 'Advens',
    industry: 'cybersécurité',
    companyInfo: '200 salariés',
    review:
      'On était à mille lieux des problématiques des personnes en précarité. Maintenant, chez Advens, on entend des mots comme “résilience”, “deuxième chance”, “rebond”, “inclusion”. Les collaborateurs sont très fiers !',
  },
];

const Reviews = () => {
  return (
    <Section id="reviews" style="muted">
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
        <span className="uk-text-primary">LinkedOut plébiscité</span> par les
        recruteurs...
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
            ) => (
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
                      {review}
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
                    <p className="uk-text-meta uk-margin-remove">
                      <span className="uk-text-bold">{company}</span>,&nbsp;
                      <span>{industry}</span>
                      {companyInfo && <span>,&nbsp;{companyInfo}</span>}
                    </p>
                  </div>
                }
              />
            )
          )}
        </Carousel>
      </div>
    </Section>
  );
};

export default Reviews;
