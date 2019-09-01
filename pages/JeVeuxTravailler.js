import React, { Fragment } from 'react';
import { Button, Section, ImgNoSSR } from '../components/utils';
import HowTo from '../components/partials/HowTo';
import { DiscovertPartial } from '../components/partials';

const JeVeuxTravailler = () => {
  const ccm = [
    {
      description: "Contactez-nous et recevez de l'aide.",
      imgSrc: '/static/img/illustrations/entourage_meet.png',
    },
    {
      description: 'Vous êtes coachés pour retrouver un poste.',
      imgSrc: '/static/img/illustrations/entourage_coaching.png',
    },
    {
      description: 'Nous vous aidons à créer un CV clair et convaincant.',
      imgSrc: '/static/img/illustrations/entourage_papers.png',
    },
    {
      description: 'Vous augmentez les chances de vous faire repérer.',
      imgSrc: '/static/img/illustrations/entourage_phone.png',
    },
  ];

  return (
    <Fragment>
      <Section id="travailler1">
        <h1 className="uk-h1 uk-text-bold uk-text-center">
          Vous souhaitez <span className="uk-text-primary">travailler</span> ?
        </h1>
        <p className="uk-text-lead uk-text-center">
          En quoi LinkedOut peut-il m'aider ? À quoi cela m'engage t-il ?
        </p>
      </Section>
      <Section id="travailler2">
        <HowTo ccm={ccm} />
      </Section>
      <Section id="travailler3" style="secondary" size="small">
        <p className="uk-text-lead uk-text-center uk-align-center uk-width-2-3@s">
          Nos candidats ont des papiers d'identités, une autorisation de travail sur le territoire français, un compte bancaire et une domiciliation.<br />
          <span className="uk-text-bold">Nous vous aidons à réunir les mêmes conditions.</span>
        </p>
      </Section>
      <Section id="travailler4">
        <h2 className="uk-text-bold uk-text-center uk-align-center uk-width-3-5@s">
          Là pour vous,<br />
          <span className="uk-text-primary">qu'elle que soit votre situation</span>
        </h2>
        <div className="uk-margin-large-top uk-child-width-1-2@m uk-child-width-1-1 uk-grid-match uk-grid-small" data-uk-grid>
          <div>
            <div className="uk-card uk-card-large uk-card-default uk-card-body">
              <div className="uk-panel uk-flex uk-flex-middle" data-uk-grid>
                <div className="uk-width-auto@s uk-width-1-1 uk-text-center">
                  <img
                    src="/static/img/illustrations/friendship.png"
                    style={{ width: "150px", height: "150px" }}
                    alt="1"
                    className="uk-margin-remove-bottom uk-margin-small-right"
                  />
                </div>
                <div className="uk-width-expand@s uk-width-1-1 uk-text-left@m uk-text-center">
                  <p>
                    Je suis prêt à intégrer le dispositif
                  </p>
                  <Button style="primary">Je postule</Button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-large uk-card-default uk-card-body">
              <div className="uk-panel uk-flex uk-flex-middle" data-uk-grid>
                <div className="uk-width-auto@s uk-width-1-1 uk-text-center">
                  <img
                    src="/static/img/illustrations/entourage_help.png"
                    style={{ width: "150px", height: "150px" }}
                    alt="2"
                    className="uk-margin-remove-bottom uk-margin-small-left"
                  />
                </div>
                <div className="uk-width-expand uk-text-left@m uk-text-center uk-flex-first@s">
                  <p >
                    Je me fais aider dans les démarches
                  </p>
                  <Button style="default">J'ai besoin d'aide</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <Section id="travailler5" style="default">
        <h4 className="uk-text-bold uk-text-center uk-align-center uk-width-3-5@s">
          Vous souhaitez <span className="uk-text-primary">nous contacter et discuter ?</span>
        </h4>
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
      <DiscovertPartial />
    </Fragment>
  );
};

export default JeVeuxTravailler;
