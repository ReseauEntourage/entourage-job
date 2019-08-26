import React, { Fragment } from 'react';
import { Button, Section } from '../components/utils';
import { DiscovertPartial } from '../components/partials';
import { ReviewCard } from '../components/cards';

const JeVeuxRecruter = () => {
  const reviews = [
    {
      author: 'Paul Jean',
      colorClass: 'uk-text-primary',
      picture: '/static/img/arthur.png',
      review:
        "Nous avons intégré Zineb à l'équipe il y a maintenant 6 mois. Tout a été rendu facile par Entourage et les équipes de travail sont très satisfaites.",
      role: 'Directeur RH chez Sanofi',
    },
    {
      author: 'Stéphane Joli',
      colorClass: '',
      picture: '/static/img/arthur.png',
      review:
        "Mohamed s'est fondu dans le groupe en un clin d'oeil, tout le monde a l'impression qu'il est là depuis 10 ans.",
      role: 'Recruteur pour LVMH',
    },
    {
      author: 'Jeanne Pierrot ',
      colorClass: 'uk-text-primary',
      picture: '/static/img/arthur.png',
      review:
        "La réinsertion est rendue plus facile grâce à Entourage Jobs, et c'est une belle victoire pour les candidats et pour les entreprises. Continuez !",
      role: 'Directrice RH chez Le grand Breguet',
    },
  ];

  return (
    <Fragment>
      <Section id="recruter1" style="default">
        <h1 className="uk-text-bold uk-text-center">
          Vous souhaitez <span className="uk-text-primary">recruter</span> un
          candidat ?
        </h1>
        <div className="uk-width-1-2 uk-align-center uk-text-center">
          <p>
            Recruteurs, plus que quiconque, faîtes la différence ! Soyez acteur
            essentiel de l'opération LinkedOut par Entourage en publiant vos
            offres d'emplois et en cherchant les candidats qui feront le bonheur
            de votre entreprise.
          </p>
          <Button style="primary">Découvrir les candidats</Button>
        </div>
      </Section>
      <Section id="recruter2" style="default">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-width-1-2 uk-margin-large-bottom">
          Une opportunité <span className="uk-text-primary">et</span> une bonne
          action,
          <span className="uk-text-primary"> ne passez pas à côté !</span>
        </h2>
        <div data-uk-grid className="uk-child-width-expand@s">
          <div>
            <div className="uk-width-5-6">
              <h3 className="uk-text-bold">
                <span className="uk-text-primary">LinkedOut plebiscité</span>{' '}
                par les recruteurs...
              </h3>
              <p>
                Le retour des recruteurs en entreprise est unanime : les
                candidats apportent une joie de vivre et une énergie qui
                facilitent leur intégration. Un bonheur au quotidien.
              </p>
            </div>
          </div>
          <div>
            {reviews.map((review, index) => (
              <ReviewCard
                author={review.author}
                colorclassName={review.colorClass}
                key={index}
                picture={review.picture}
                review={review.review}
                role={review.role}
              />
            ))}
          </div>
        </div>
      </Section>
      <Section id="recruter3" style="default">
        <h3 className="uk-text-bold uk-text-center uk-align-center uk-width-3-5">
          Du premier contact à l'intégration en entreprise,{' '}
          <span className="uk-text-primary">comment ça marche</span>
        </h3>
        <div
          className="uk-child-width-1-4@m uk-child-width-1-2@s uk-grid-match"
          data-uk-grid
        >
          <div className="uk-card">
            <div className="uk-card-media-top">
              <img
                src="/static/img/illustrations/entourage_phone.png"
                alt="1"
              />
            </div>
            <div className="uk-card-body">
              <div className="uk-flex">
                <div className="uk-width-1-6 uk-text-lead uk-text-primary uk-text-bold">
                  1
                </div>
                <div className="uk-width-5-6">Lorem ipsum lorem ipsum</div>
              </div>
            </div>
          </div>
          <div className="uk-card">
            <div className="uk-card-media-top">
              <img
                src="/static/img/illustrations/entourage_papers.png"
                alt="2"
              />
            </div>
            <div className="uk-card-body">
              <div className="uk-flex">
                <div className="uk-width-1-6 uk-text-lead uk-text-primary uk-text-bold">
                  2
                </div>
                <div className="uk-width-5-6">Lorem ipsum lorem ipsum</div>
              </div>
            </div>
          </div>
          <div className="uk-card">
            <div className="uk-card-media-top">
              <img src="/static/img/illustrations/entourage_meet.png" alt="3" />
            </div>
            <div className="uk-card-body">
              <div className="uk-flex">
                <div className="uk-width-1-6 uk-text-lead uk-text-primary uk-text-bold">
                  3
                </div>
                <div className="uk-width-5-6">Lorem ipsum lorem ipsum</div>
              </div>
            </div>
          </div>
          <div className="uk-card">
            <div className="uk-card-media-top">
              <img
                src="/static/img/illustrations/entourage_phone.png"
                alt="4"
              />
            </div>
            <div className="uk-card-body">
              <div className="uk-flex">
                <div className="uk-width-1-6 uk-text-lead uk-text-primary uk-text-bold">
                  4
                </div>
                <div className="uk-width-5-6">Lorem ipsum lorem ipsum</div>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <Section id="recruter4" style="default">
        <h2 className="uk-text-bold uk-text-center uk-align-center uk-width-3-5">
          Vous avez des opportunités d'emplois ?{' '}
          <span className="uk-text-primary">Discutons</span>
        </h2>
        <div
          className="uk-align-center uk-text-center uk-margin-large-top"
          data-uk-grid
        >
          <div className="uk-inline uk-padding-remove">
            <Button style="primary">écrivez-nous</Button>
          </div>
          <div className="uk-inline">
            <Button>Rappelez-moi</Button>
          </div>
        </div>
      </Section>
      <Section id="recruter5" style="default">
        <h3 className="uk-text-bold uk-text-center uk-align-center uk-width-3-5">
          Foire Aux <span className="uk-text-primary">Questions</span>
        </h3>
        <div className="uk-width-4-5 uk-align-center">
          <hr className="uk-margin-large-bottom" />
          <ul data-uk-accordion>
            <li className="uk-open">
              <a className="uk-accordion-title" href="#">
                Quels sont les types de contrat recherchés par les candidats ?
              </a>
              <div className="uk-accordion-content">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </li>
            <li>
              <a className="uk-accordion-title" href="#">
                Question 2
              </a>
              <div className="uk-accordion-content">
                <p>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor reprehenderit.
                </p>
              </div>
            </li>
            <li>
              <a className="uk-accordion-title" href="#">
                Question 3
              </a>
              <div className="uk-accordion-content">
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat proident.
                </p>
              </div>
            </li>
            <li>
              <a className="uk-accordion-title" href="#">
                Question 4
              </a>
              <div className="uk-accordion-content">
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat proident.
                </p>
              </div>
            </li>
            <li>
              <a className="uk-accordion-title" href="#">
                Question 5
              </a>
              <div className="uk-accordion-content">
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat proident.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </Section>
      <DiscovertPartial />
    </Fragment>
  );
};

export default JeVeuxRecruter;
