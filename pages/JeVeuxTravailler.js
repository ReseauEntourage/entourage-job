import React, { Fragment } from 'react';
import { Button, Section } from '../components/utils';
import HowTo from '../components/partials/HowTo';
import { DiscovertPartial } from '../components/partials';

const JeVeuxTravailler = () => {
  const ccm = [{
    description: "Contactez-nous et recevez de l'aide.",
    imgSrc: "/static/img/illustrations/entourage_meet.png"
  }, {
    description: "Vous êtes coachés pour retrouver un poste.",
    imgSrc: "/static/img/illustrations/entourage_phone.png"
  }, {
    description: "Nous vous aidons à créer un CV clair et convaincant.",
    imgSrc: "/static/img/illustrations/entourage_papers.png"
  }, {
    description: "Vous augmentez les chances de vous faire repérer.",
    imgSrc: "/static/img/illustrations/entourage_phone.png"
  }];

  return (
    <Fragment>
      <Section id="travailler1">
        <h1 className="uk-h1 uk-text-bold uk-text-center">
          Vous souhaitez <span className="uk-text-primary">travailler</span> ?
        </h1>
        <p className="uk-text-lead uk-text-center">En quoi LinkedOut peut-il m'aider ? À quoi cela m'engage t-il ?</p>
      </Section>
      <Section id="travailler2">
        <HowTo ccm={ccm} />
      </Section>
      <Section id="travailler3" style="secondary" size="small">
        <p className="uk-text-lead uk-width-2-3 uk-text-center uk-align-center">
          Nos candidats ont des papiers d'identités, une autorisation de travail sur le territoire français, un compte bancaire et une domiciliation.<br />
          <span className="uk-text-bold">Nous vous aidons à réunir les mêmes conditions.</span>
        </p>
      </Section>
      <Section id="travailler4">
        <h2 className="uk-text-bold uk-text-center uk-align-center uk-width-3-5">
          Là pour vous,<br />
          <span className="uk-text-primary">qu'elle que soit votre situation</span>
        </h2>
        <div className="uk-margin-large-top uk-child-width-1-2@s uk-grid-match" data-uk-grid>
          <div>
            <div className="uk-card uk-card-large uk-card-default uk-card-body">
              <div data-uk-grid>
                <div className="uk-width-1-1@s uk-width-small@m uk-flex uk-flex-center ">
                  <img src="/static/img/illustrations/entourage_meet.png" alt="1" className="uk-height-max-small" />
                </div>
                <div className="uk-width-expand">
                  <p className="uk-text-center uk-text-left@m">
                    Je suis prêt à intégrer le dispositif
                  </p>
                  <Button style="primary">Je postule</Button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-large uk-card-default uk-card-body">
              <div data-uk-grid>
                <div className="uk-width-expand">
                  <p className="uk-text-center uk-text-left@m">
                    Je me fais aider dans les démarches
                  </p>
                  <Button style="default">J'ai besoin d'aide</Button>
                </div>
                <div className="uk-width-1-1@s uk-width-small@m uk-flex uk-flex-center ">
                  <img src="/static/img/illustrations/entourage_meet.png" alt="1" className="uk-height-max-small" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <Section id="travailler5" style="default">
        <h4 className="uk-text-bold uk-text-center uk-align-center uk-width-3-5">
          Vous souhaitez <span className="uk-text-primary">nous contacter et discuter ?</span>
        </h4>
        <div
          className="uk-align-center uk-text-center uk-margin-small-top"
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
      <DiscovertPartial />
    </Fragment>
  );
};

export default JeVeuxTravailler;
