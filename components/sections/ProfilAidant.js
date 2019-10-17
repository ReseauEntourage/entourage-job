import React, { Component } from 'react';
import { Section, Button } from '../utils';

export default class ProfilAidant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileSelect: 0,
    };
  }

  render() {
    const cardsCoupsDePouce = [
      [
        {
          title:
            'Ouvrez votre réseau en partageant le CV d’un ou de plusieurs candidats LinkedOut',
          description:
            'Votre partage permet de donner une visibilité inédite aux candidats auprès de recruteurs et de générer des opportunités d’emploi. Un partage peut tout changer !',
          picture: '/static/img/illustrations/entourage_help.png',
        },
        {
          title: 'Devenez bénévole-coach !',
          description:
            'Vous souhaitez donner de votre temps pour tisser une relation de confiance avec un candidat et le coacher vers le retour à l’emploi ? Entourage vous forme à la mission de bénévole-coach et vous donne les outils !',
          picture: '/static/img/illustrations/entourage_papers.png',
          writeButton: true,
        },
        {
          title:
            'Vous souhaitez apporter au projet LinkedOut une compétence particulière ?',
          description:
            '(Montage photo, animation d’ateliers ou de temps conviviaux...) Nous serons ravis d’intégrer votre talent au sein du projet.',
          picture: '/static/img/illustrations/entourage_phone.png',
          writeButton: true,
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
          title:
            'Un Autre texte ? Entourage vous accompagne dans les démarches',
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
        title: (
          <p className="uk-text-lead" style={{ fontWeight: '600' }}>
            Je suis un particulier
          </p>
        ),
        titleSelect: (
          <h2 className="uk-text-bold">
            Je suis <span className="uk-text-primary">un particulier</span>
          </h2>
        ),
        description:
          "LinkedOut cherche à recruter des bénévoles dont le rôle sera d'accompagner les personnes dans leur recherche d'emploi.",
        cards: cardsCoupsDePouce[0],
      },
      {
        title: (
          <p className="uk-text-lead" style={{ fontWeight: '600' }}>
            Je suis un acteur du milieu associatif ou social
          </p>
        ),
        titleSelect: (
          <h2 className="uk-text-bold">
            Je suis un acteur du{' '}
            <span className="uk-text-primary">milieu associatif ou social</span>
          </h2>
        ),
        description:
          "Entourage cherche à construire son dispositif en collaboration avec d'autres acteurs de l'insertion ayant des expertises complémentaires. Contactez-nous pour rejoindre le projet ou apporter votre savoir-faire",
        cards: cardsCoupsDePouce[1],
      },
      {
        title: (
          <p className="uk-text-lead" style={{ fontWeight: '600' }}>
            Je suis un employeur
          </p>
        ),
        titleSelect: (
          <h2 className="uk-text-bold">
            Je suis <span className="uk-text-primary">un employeur</span>
          </h2>
        ),
        description:
          "Contactez-nous si une personne que vous accompagnez vous semble pouvoir bénéficier du programme LinkedOut, que vous voulez apprendre à rédiger des CVs selon le modèle LinkedOut pour recevoir de l'aide dans les démarches de recherche d'emploi",
        cards: cardsCoupsDePouce[2],
      },
    ];

    const { profileSelect } = this.state;

    return (
      <Section id="profilAidant">
        <div data-uk-grid className="uk-child-width-1-2@m uk-child-width-2-3@s">
          <div>
            <div className="uk-width-5-6">
              <ul
                className="uk-list"
                data-uk-switcher="connect: .switcher-container"
              >
                {coupsDePouce.map((coupDePouce, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="uk-link-reset"
                      onClick={() => {
                        this.setState({ profileSelect: index });
                      }}
                    >
                      {profileSelect === index
                        ? coupDePouce.titleSelect
                        : coupDePouce.title}
                    </a>
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
                            <Button
                              style="default"
                              className={
                                card.writeButton ? 'uk-visible' : 'uk-hidden'
                              }
                            >
                              écrivez-nous
                            </Button>
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
    );
  }
}
