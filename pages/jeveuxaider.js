import React from 'react';
import { HelpingCard, ScaleCard } from '../components/cards';
import { Button, Section, GridNoSSR, SliderNoSSR } from '../components/utils';
import { DiscoverPartial } from '../components/partials';
import Layout from '../components/Layout';

const cardsCoupsDePouce = [
  [
    {
      title:
        'Vous connaissez une personne en difficulté ? Entourage vous accompagne dans les démarches',
      description:
        "Vous n'êtes pas seul ! Entourage vous donne les outils pour soutenir efficacement une personne dans sa recherche professionnelle et dans sa prise de poste.",
      picture: '/static/img/illustrations/entourage_help.png',
    },
    {
      title: '2ème texte ? Entourage vous accompagne dans les démarches',
      description:
        "Vous n'êtes pas seul ! Entourage vous donne les outils pour soutenir efficacement une personne dans sa recherche professionnelle et dans sa prise de poste.",
      picture: '/static/img/illustrations/entourage_papers.png',
    },
    {
      title: '3ème texte  ? Entourage vous accompagne dans les démarches',
      description:
        "Vous n'êtes pas seul ! Entourage vous donne les outils pour soutenir efficacement une personne dans sa recherche professionnelle et dans sa prise de poste.",
      picture: '/static/img/illustrations/entourage_phone.png',
    },
  ],
  [
    {
      title: 'Autre texte ? Entourage vous accompagne dans les démarches',
      description:
        "Vous n'êtes pas seul ! Entourage vous donne les outils pour soutenir efficacement une personne dans sa recherche professionnelle et dans sa prise de poste.",
      picture: '/static/img/illustrations/entourage_meet.png',
    },
    {
      title: 'Un Autre texte ? Entourage vous accompagne dans les démarches',
      description:
        "Vous n'êtes pas seul ! Entourage vous donne les outils pour soutenir efficacement une personne dans sa recherche professionnelle et dans sa prise de poste.",
      picture: '/static/img/illustrations/entourage_help.png',
    },
    {
      title:
        'Encore un autre texte ? Entourage vous accompagne dans les démarches',
      description:
        "Vous n'êtes pas seul ! Entourage vous donne les outils pour soutenir efficacement une personne dans sa recherche professionnelle et dans sa prise de poste.",
      picture: '/static/img/illustrations/entourage_coaching.png',
    },
  ],
  [
    {
      title: '7 ? Entourage vous accompagne dans les démarches',
      description:
        "Vous n'êtes pas seul ! Entourage vous donne les outils pour soutenir efficacement une personne dans sa recherche professionnelle et dans sa prise de poste.",
      picture: '/static/img/illustrations/entourage_help.png',
    },
    {
      title: '8 ? Entourage vous accompagne dans les démarches',
      description:
        "Vous n'êtes pas seul ! Entourage vous donne les outils pour soutenir efficacement une personne dans sa recherche professionnelle et dans sa prise de poste.",
      picture: '/static/img/illustrations/entourage_phone.png',
    },
    {
      title: '9 ? Entourage vous accompagne dans les démarches',
      description:
        "Vous n'êtes pas seul ! Entourage vous donne les outils pour soutenir efficacement une personne dans sa recherche professionnelle et dans sa prise de poste.",
      picture: '/static/img/illustrations/entourage_papers.png',
    },
  ],
  [
    {
      title: '10 ? Entourage vous accompagne dans les démarches',
      description:
        "Vous n'êtes pas seul ! Entourage vous donne les outils pour soutenir efficacement une personne dans sa recherche professionnelle et dans sa prise de poste.",
      picture: '/static/img/illustrations/entourage_coaching.png',
    },
    {
      title: '11 ? Entourage vous accompagne dans les démarches',
      description:
        "Vous n'êtes pas seul ! Entourage vous donne les outils pour soutenir efficacement une personne dans sa recherche professionnelle et dans sa prise de poste.",
      picture: '/static/img/illustrations/entourage_papers.png',
    },
    {
      title: '12 ? Entourage vous accompagne dans les démarches',
      description:
        "Vous n'êtes pas seul ! Entourage vous donne les outils pour soutenir efficacement une personne dans sa recherche professionnelle et dans sa prise de poste.",
      picture: '/static/img/illustrations/entourage_help.png',
    },
  ],
];

const coupsDePouce = [
  {
    title: 'Je suis un particulier',
    description:
      "LinkedOut cherche à recruter des bénévoles dont le rôle sera d'accompagner les personnes dans leur recherche d'emploi.",
    cards: cardsCoupsDePouce[0],
  },
  {
    title: 'Je suis un acteur du milieu associatif',
    description:
      "Entourage cherche à construire son dispositif en collaboration avec d'autres acteurs de l'insertion ayant des expertises complémentaires. Contactez-nous pour rejoindre le projet ou apporter votre savoir-faire",
    cards: cardsCoupsDePouce[1],
  },
  {
    title: 'Je suis un travailleur social',
    description:
      "Contactez-nous si une personne que vous accompagnez vous semble pouvoir bénéficier du programme LinkedOut, que vous voulez apprendre à rédiger des CVs selon le modèle LinkedOut pour recevoir de l'aide dans les démarches de recherche d'emploi",
    cards: cardsCoupsDePouce[2],
  },
  {
    title: 'Je veux recruter',
    description:
      "Contactez-nous si une personne que vous accompagnez vous semble pouvoir bénéficier du programme LinkedOut, que vous voulez apprendre à rédiger des CVs selon le modèle LinkedOut pour recevoir de l'aide dans les démarches de recherche d'emploi",
    cards: cardsCoupsDePouce[3],
  },
];

const JeVeuxAider = () => (
  <Layout title="Je veux aider - Entourage Jobs">
    <Section id="help" style="default">
      <h1 className="uk-text-center">
        Vous souhaitez <span className="uk-text-primary">aider</span> ?
      </h1>
      <GridNoSSR
        childWidths={['1-1', '1-3@m']}
        grid="small"
        items={[
          <HelpingCard
            titleHead="Vous connaissez une personne en difficulté ? "
            titleMiddle="Entourage vous accompagne"
            titleTail=" dans les démarches"
            description="Vous n'êtes pas seul! Entourage vous donne les outils pour soutenir efficacement une personne danssa recherche professionnelle et dans sa prise de poste"
            img="/static/img/help_1.png"
            alt="help_1"
          />,
          <HelpingCard
            titleHead="Vous connaissez une personne en difficulté ? "
            titleMiddle="Entourage vous accompagne"
            titleTail=" dans les démarches"
            description="Vous n'êtes pas seul! Entourage vous donne les outils pour soutenir efficacement une personne danssa recherche professionnelle et dans sa prise de poste"
            img="/static/img/help_2.png"
            alt="help_2"
          />,
          <HelpingCard
            titleHead="Vous connaissez une personne en difficulté ? "
            titleMiddle="Entourage vous accompagne"
            titleTail=" dans les démarches"
            description="Vous n'êtes pas seul! Entourage vous donne les outils pour soutenir efficacement une personne danssa recherche professionnelle et dans sa prise de poste"
            img="/static/img/help_3.png"
            alt="help_3"
          />,
        ]}
      />
    </Section>
    <Section id="aider2">
      <h2 className="uk-text-bold uk-margin-large-bottom uk-width-3-5@m uk-width-4-5@s">
        Il n'y a pas de petit coup de pouce.
        <br />
        Aidez <span className="uk-text-primary">à votre échelle</span>
      </h2>
      <div data-uk-grid className="uk-child-width-1-2@m uk-child-width-2-3@s">
        <div>
          <div className="uk-width-5-6">
            <ul
              data-uk-accordion="collapsible: false"
              data-uk-switcher="connect: .switcher-container"
            >
              {coupsDePouce.map((coupDePouce, index) => (
                <li key={index}>
                  <a className="uk-accordion-title" href="#">
                    {coupDePouce.title}
                  </a>
                  <div className="uk-accordion-content">
                    <p>{coupDePouce.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <ul className="uk-switcher switcher-container uk-margin">
            {coupsDePouce.map((coupDePouce, index) => (
              <li key={index}>
                <div>
                  {coupDePouce.cards.map((card, index2) => (
                    <div
                      key={index2}
                      className="uk-card uk-card-small uk-card-default uk-card-body"
                    >
                      <div
                        className="uk-panel uk-flex uk-flex-middle"
                        data-uk-grid
                      >
                        <div className="uk-width-auto@s uk-width-1-1 uk-text-center">
                          <img
                            src={card.picture}
                            style={{ width: '150px', height: '150px' }}
                            alt=""
                            className="uk-margin-remove-bottom uk-margin-small-left"
                          />
                        </div>
                        <div className="uk-width-expand uk-text-left@m uk-text-center uk-flex-first@s">
                          <h6 className="uk-text-bold">{card.title}</h6>
                          <p className="uk-text-meta">{card.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
    <Section style="muted">
      <div className="uk-text-center" id="scale">
        <h2>
          Aider <span className="uk-text-primary">à votre échelle</span>
        </h2>
        <SliderNoSSR
          auto
          finite={false}
          childWidths={['1-1', '1-2@s', '1-4@m']}
          grid="small"
          items={[
            <ScaleCard
              title="Je suis un particulier"
              titleEmphaseStart={2}
              description="Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Laboriosam repellat suscipit, quo iure similique beatae
                recusandae eius itaque."
            />,
            <ScaleCard
              title="Je suis un acteur du millieu associatif"
              titleEmphaseStart={2}
              description="Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Laboriosam repellat suscipit, quo iure similique beatae
                recusandae eius itaque."
            />,
            <ScaleCard
              title="Je veux recruter"
              titleEmphaseStart={2}
              description="Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Laboriosam repellat suscipit, quo iure similique beatae
                recusandae eius itaque."
            />,
            <ScaleCard
              title="Je suis un travailleur social"
              titleEmphaseStart={2}
              description="Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Laboriosam repellat suscipit, quo iure similique beatae
                recusandae eius itaque."
            />,
          ]}
        />
        <Button style="primary">écrivez-nous</Button>
      </div>
    </Section>
    <DiscoverPartial />
  </Layout>
);

export default JeVeuxAider;
