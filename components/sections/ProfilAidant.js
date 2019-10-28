import React, { Component } from 'react';
import { Section, IconNoSSR, Button } from '../utils';
import ModalInterestLinkedOut from '../modals/ModalInterestLinkedOut';
import ModalSpecialSkill from '../modals/ModalSpecialSkill';

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
          title: (
            <h4 className="uk-text-bold">
              Ouvrez <span className="uk-text-primary">votre réseau</span> en{' '}
              <span className="uk-text-primary">partageant le CV</span> d’un ou
              de plusieurs candidats LinkedOut
            </h4>
          ),
          description:
            'Votre partage permet de donner une visibilité inédite aux candidats auprès de recruteurs et de générer des opportunités d’emploi. Un partage peut tout changer !',
          picture: '/static/img/illustrations/Personnage-Entourage-5.png',
        },
        {
          title: (
            <h4 className="uk-text-bold">
              Devenez <span className="uk-text-primary">bénévole-coach !</span>
            </h4>
          ),
          description:
            'Vous souhaitez donner de votre temps pour tisser une relation de confiance avec un candidat et le coacher vers le retour à l’emploi ? Entourage vous forme à la mission de bénévole-coach et vous donne les outils !',
          picture: '/static/img/illustrations/helping_process.png',
        },
        {
          title: (
            <h4 className="uk-text-bold">
              Vous souhaitez apporter au projet LinkedOut{' '}
              <span className="uk-text-primary">
                une compétence particulière ?
              </span>
            </h4>
          ),
          description: (
            <>
              <p>
                (Montage photo, animation d’ateliers ou de temps conviviaux...)
                Nous serons ravis d’intégrer votre talent au sein du projet.
              </p>

              <button
                type="button"
                className="uk-button uk-button-default"
                href="#"
                data-uk-toggle="target: #modalSpecialSkill"
              >
                Ecrivez-nous
              </button>
              <ModalSpecialSkill id="modalSpecialSkill" />
            </>
          ),
          picture: '/static/img/illustrations/Idee-reseau-entourage-dessin.png',
        },
        {
          title: (
            <h4 className="uk-text-bold">
              <span className="uk-text-primary">Soutenez LinkedOut</span> en
              faisant un don
            </h4>
          ),
          description: (
            <button
              type="button"
              className="uk-button uk-button-default"
              href="#"
              data-uk-toggle="target: #modalFaireDon"
            >
              Écrivez-nous
            </button>
          ),
          picture: '/static/img/illustrations/download.png',
        },
      ],
      [
        {
          title: (
            <h4 className="uk-text-bold">
              Vous accompagnez un personne{' '}
              <span className="uk-text-primary">
                en démarche de réinsertion professionnelle.
              </span>
            </h4>
          ),
          description: (
            <Button style="primary" href="#">
              Nous l&apos;orienter
            </Button>
          ),
          picture: '/static/img/illustrations/Personnage-Entourage-5.png',
        },
        {
          title: (
            <h4 className="uk-text-bold">
              Vous êtes intéressés par le projet LinkedOut et vous souhaiteriez
              collaborer avec nous.
            </h4>
          ),
          description: (
            <>
              <button
                type="button"
                className="uk-button uk-button-default"
                href="#"
                data-uk-toggle="target: #modalInterestLinkedOut"
              >
                Écrivez-nous
              </button>
              <ModalInterestLinkedOut
                candidat={{ id: 'test', firstName: 'test' }}
              />
            </>
          ),
          picture: '/static/img/illustrations/helping_process.png',
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
        titleSelect: (
          <span className="uk-text-bold">
            Je suis <span className="uk-text-primary">un particulier</span>
          </span>
        ),
        description:
          "LinkedOut cherche à recruter des bénévoles dont le rôle sera d'accompagner les personnes dans leur recherche d'emploi.",
        cards: cardsCoupsDePouce[0],
      },
      {
        title: 'Je suis un acteur du milieu associatif ou social',
        titleSelect: (
          <span className="uk-text-bold">
            Je suis un acteur du{' '}
            <span className="uk-text-primary">milieu associatif ou social</span>
          </span>
        ),
        description:
          "Entourage cherche à construire son dispositif en collaboration avec d'autres acteurs de l'insertion ayant des expertises complémentaires. Contactez-nous pour rejoindre le projet ou apporter votre savoir-faire",
        cards: cardsCoupsDePouce[1],
      },
      {
        title: 'Je suis un employeur',
        titleSelect: (
          <span className="uk-text-bold">
            Je suis <span className="uk-text-primary">un employeur</span>
          </span>
        ),
        description:
          "Contactez-nous si une personne que vous accompagnez vous semble pouvoir bénéficier du programme LinkedOut, que vous voulez apprendre à rédiger des CVs selon le modèle LinkedOut pour recevoir de l'aide dans les démarches de recherche d'emploi",
        cards: cardsCoupsDePouce[2],
      },
    ];

    const { profileSelect } = this.state;

    return (
      <Section id="profilAidant">
        <div className="uk-flex-center" data-uk-grid>
          <div className="uk-width-2-5@m uk-width-1-1">
            <div className="uk-width-5-6@m">
              <ul className="uk-list uk-margin-large-top uk-visible@m">
                {coupsDePouce.map((coupDePouce, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="uk-link-reset"
                      onClick={() => {
                        this.setState({ profileSelect: index });
                      }}
                    >
                      <h2>
                        {profileSelect === index
                          ? coupDePouce.titleSelect
                          : coupDePouce.title}
                      </h2>
                    </a>
                  </li>
                ))}
              </ul>
              <div
                className="uk-inline uk-hidden@m uk-width-1-1 zone-dropdown"
                data-uk-toggle="target: .triangle-direction"
              >
                <button
                  className="uk-button uk-button-default uk-width-1-1 uk-padding-small btn-dropdown"
                  style={{ border: '2px solid rgba(246,107,40,0.5)' }}
                  type="button"
                >
                  <div className="uk-width-1-1 uk-flex-middle" data-uk-grid>
                    <div className="uk-width-expand">
                      <h4>{coupsDePouce[profileSelect].titleSelect}</h4>
                    </div>
                    <div className="uk-width-auto uk-text-primary triangle-direction">
                      <IconNoSSR name="triangle-down" ratio={1.5} />
                    </div>
                    <div
                      className="uk-width-auto uk-text-primary triangle-direction"
                      hidden
                    >
                      <IconNoSSR name="triangle-up" ratio={1.5} />
                    </div>
                  </div>
                </button>
                <div
                  id="dropdownProfile"
                  className="uk-dropdown-close"
                  data-uk-dropdown="mode: click; pos: bottom-justify; boundary: .zone-dropdown; boundary-align: true"
                >
                  <ul className="uk-list uk-margin-large-top">
                    {coupsDePouce.map((coupDePouce, index) => (
                      <li key={index}>
                        <a
                          href="#"
                          className="uk-link-reset"
                          onClick={() => {
                            this.setState({ profileSelect: index });
                          }}
                        >
                          <h4>
                            {profileSelect === index
                              ? coupDePouce.titleSelect
                              : coupDePouce.title}
                          </h4>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="uk-width-3-5@m uk-width-1-1 uk-margin">
            {coupsDePouce[profileSelect].cards.map((card, index2) => (
              <div
                key={index2}
                className="uk-card uk-card-default uk-card-body uk-grid-small uk-margin-auto"
                data-uk-grid
                style={{
                  border: '5px solid rgba(246,107,40,0.15)',
                  borderRadius: '12px',
                }}
              >
                <div
                  className="uk-panel uk-flex uk-flex-middle uk-grid-small"
                  data-uk-grid
                >
                  <div className="uk-width-auto@s uk-width-1-1 uk-text-center">
                    <img
                      src={card.picture}
                      style={{ width: '225px' }}
                      alt=""
                      className="uk-margin-remove-bottom uk-margin-small-left"
                    />
                  </div>
                  <div className="uk-width-expand uk-text-left@m uk-text-center uk-flex-first@s">
                    {card.title}
                    <p>{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    );
  }
}
