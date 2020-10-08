import React from 'react';
import { Section } from '../utils';
import Carousel from '../utils/Carousel';
import { ReviewCard } from '../cards';

const reviews = [
  {
    author: 'Paul Jean',
    colorClass: 'uk-text-primary',
    review:
      "Nous avons intégré Zineb à l'équipe il y a maintenant 6 mois. Tout a été rendu facile par Entourage et les équipes de travail sont très satisfaites.",
    role: 'Directeur RH chez Sanofi',
  },
  {
    author: 'Stéphane Joli',
    colorClass: '',
    review:
      "Mohamed s'est fondu dans le groupe en un clin d'oeil, tout le monde a l'impression qu'il est là depuis 10 ans.",
    role: 'Recruteur pour LVMH',
  },
  {
    author: 'Jeanne Pierrot ',
    colorClass: 'uk-text-primary',
    review:
      "La réinsertion est rendue plus facile grâce à LinkedOut, et c'est une belle victoire pour les candidats et pour les entreprises. Continuez !",
    role: 'Directrice RH chez Le grand Breguet',
  },
  {
    author: 'Titouan Pereirra ',
    colorClass: 'uk-text-primary',
    review:
      'Les candidats sont devenus des atouts importants au sein de notre magasin, nous sommes ravis !',
    role: 'Chef de rayon chez Monoprix',
  },
];

const Reviews = () => {
  return (
    <Section id="reviews" style="muted">
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
        <span className="uk-text-primary">LinkedOut plébiscité</span> par les
        recruteurs...
      </h2>
      <div className="uk-width-expand">
        <Carousel style="default" containerClasses="uk-child-width-1-1">
          {reviews.map((review, index) => (
            <ReviewCard
              author={review.author}
              colorclassName={review.colorClass}
              key={index}
              review={review.review}
              role={review.role}
            />
          ))}
        </Carousel>
      </div>
    </Section>
  );
};

export default Reviews;
