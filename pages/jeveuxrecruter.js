import React from 'react';
import Layout from '../components/Layout';
import { Button, Section } from '../components/utils';
import { DiscoverPartial } from '../components/partials';
import { ReviewCard } from '../components/cards';
import HowTo from '../components/partials/HowTo';
import StepCard from '../components/cards/StepCard';

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

  const faq = [
    {
      question:
        'Quels sont les types de contrat recherchés par les candidats ?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      question: 'Question 2',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      question: 'Question 3',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      question: 'Question 4',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      question: 'Question 5',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  ];

  return (
    <Layout title="Je veux recruter - Entourage Jobs">
      <Section id="recruter1">
        <h1 className="uk-text-bold uk-text-center">
          Vous souhaitez <span className="uk-text-primary">recruter</span> un
          candidat ?
        </h1>
        <div className="uk-align-center uk-text-center uk-width-1-2@m uk-width-2-3@s">
          <p>
            Recruteurs, plus que quiconque, faîtes la différence ! Soyez acteur
            essentiel de l'opération LinkedOut par Entourage en publiant vos
            offres d'emplois et en cherchant les candidats qui feront le bonheur
            de votre entreprise.
          </p>
          <Button style="primary">Découvrir les candidats</Button>
        </div>
      </Section>
      <Section id="recruter2">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-width-1-2@m uk-width-2-3@s">
          Une opportunité <span className="uk-text-primary">et</span> une bonne
          action,
          <span className="uk-text-primary"> ne passez pas à côté !</span>
        </h2>
        <div data-uk-grid className="uk-child-width-1-2@m uk-child-width-2-3@s">
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
      <HowTo
        title={
          <h3 className="uk-text-bold uk-text-center uk-align-center uk-width-3-5@s">
            Du premier contact à l&apos;intégration en entreprise,{' '}
            <span className="uk-text-primary">comment ça marche</span>
          </h3>
        }
      >
        <StepCard
          numStep={1}
          img="/static/img/illustrations/entourage_phone.png"
          description="Lorem ipsum lorem ipsum"
        />
        <StepCard
          numStep={2}
          img="/static/img/illustrations/entourage_papers.png"
          description="Lorem ipsum lorem ipsum"
        />
        <StepCard
          numStep={3}
          img="/static/img/illustrations/entourage_meet.png"
          description="Lorem ipsum lorem ipsum"
        />
        <StepCard
          numStep={4}
          img="/static/img/illustrations/entourage_phone.png"
          description="Lorem ipsum lorem ipsum"
        />
      </HowTo>
      <Section id="recruter4" style="default">
        <h2 className="uk-text-bold uk-text-center uk-align-center uk-width-3-5@s">
          Vous avez des opportunités d'emplois ?{' '}
          <span className="uk-text-primary">Discutons</span>
        </h2>
        <div
          className="uk-align-center uk-text-center uk-margin-large-top"
          data-uk-grid
        >
          <div className="uk-inline uk-padding-small">
            <Button style="primary">écrivez-nous</Button>
          </div>
          <div className="uk-inline uk-padding-small uk-margin-remove">
            <Button style="default">Rappelez-moi</Button>
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
            {faq.map((question, index) => (
              <li className={index === 0 ? 'uk-open' : undefined} key={index}>
                <a className="uk-accordion-title" href="#">
                  {question.question}
                </a>
                <div className="uk-accordion-content">
                  <p>{question.answer}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>
      <DiscoverPartial />
    </Layout>
  );
};

export default JeVeuxRecruter;
