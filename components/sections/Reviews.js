import React from 'react';
import {Section} from '../utils';
import Carousel from "../utils/Carousel";
import {ReviewCard} from "../cards";

const Reviews = () => {
  const content = [
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
        "Les candidats sont devenus des atouts importants au sein de notre magasin, nous sommes ravis !",
      role: 'Chef de rayon chez Monoprix',
    },
  ];

  return (
    <Section id="reviews">
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
        <span className="uk-text-primary">LinkedOut plebiscité</span>{' '}
        par les recruteurs...
      </h2>
      <h4 className="uk-align-center uk-text-center uk-margin-medium-bottom">
        Le retour des recruteurs en entreprise est unanime&nbsp;: l&apos;arrivée des candidats fédère les salariés et transforme le projet d&apos;entreprise en une véritable aventure humaine, porteuse de sens pour tous&nbsp;!
      </h4>
      <div className="uk-width-expand">
        <Carousel
          itemRenderer={(review, index) => (
            <div key={index.toString()}>
              <ReviewCard
                author={review.author}
                colorclassName={review.colorClass}
                key={index}
                review={review.review}
                role={review.role}
              />
            </div>
          )}
          style="default"
          items={content}
          containerClasses="uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-4@m uk-grid uk-grid-match uk-grid-small" />
      </div>
    </Section>
  );
};

Reviews.propTypes = {

};

Reviews.defaultProps = {
};

export default Reviews;
