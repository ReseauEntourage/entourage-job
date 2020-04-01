import React from 'react';
import Layout from '../components/Layout';
import { Button, Section } from '../components/utils';
import HowTo from '../components/sections/HowTo';
import { DiscoverPartial } from '../components/partials';
import SituationCard from '../components/cards/SituationCard';
import ModalContactUs from '../components/modals/ModalContactUs';

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
    <Layout title="Je veux travailler - LinkedOut">
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
          Nos candidats ont des papiers d'identités, une autorisation de travail
          sur le territoire français, un compte bancaire et une domiciliation.
          <br />
          <span className="uk-text-bold">
            Nous vous aidons à réunir les mêmes conditions.
          </span>
        </p>
      </Section>
      <Section id="travailler4">
        <h2 className="uk-text-bold uk-text-center uk-align-center uk-width-3-5@s">
          Là pour vous,
          <br />
          <span className="uk-text-primary">
            qu'elle que soit votre situation
          </span>
        </h2>
        <div
          className="uk-margin-large-top uk-child-width-1-2@m uk-child-width-1-1 uk-grid-match uk-grid-small"
          data-uk-grid
        >
          <div>
            <SituationCard
              isLeft
              imgSrc="/static/img/illustrations/friendship.png"
            >
              <p>J&apos;ai les papiers requis pour intégrer LinkedOut</p>
              <Button
                style="primary"
                href={process.env.AIRTABLE_LINK_JOIN_LINKEDOUT}
                isExternal
                newTab
              >
                Je rejoins LinkedOut
              </Button>
            </SituationCard>
          </div>
          <div>
            <SituationCard imgSrc="/static/img/illustrations/entourage_help.png">
              <p>
                Je n'ai pas les papiers requis pour rejoindre LinkedOut, je
                souhaite être aidé et réorienté
              </p>
              <Button style="default" toggle="target: #modalContactUs">
                contactez nous
              </Button>
              <ModalContactUs />
            </SituationCard>
          </div>
        </div>
      </Section>
      <Section id="travailler5" style="default">
        <h4 className="uk-text-bold uk-text-center uk-align-center uk-width-3-5@s">
          Vous souhaitez{' '}
          <span className="uk-text-primary">nous contacter et discuter ?</span>
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
      <DiscoverPartial />
    </Layout>
  );
};

export default JeVeuxTravailler;
