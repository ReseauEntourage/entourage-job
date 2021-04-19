import React from 'react';
import { IconNoSSR, Section } from '../utils';
import Button from '../utils/Button';
import { event } from '../../lib/gtag';
import TAGS from '../../constants/tags';
import { SharePartial } from '../partials';

const StepsToJoin = () => {
  return (
    <Section container="small" id="stepsToJoin" style="default">
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
        Comment <span className="uk-text-primary">s&apos;inscrire&nbsp;?</span>
      </h2>
      <h4 className="uk-text-bold uk-text-center uk-margin-large-top">
        Prochaine promotion en Mai 2021 dédiée aux jeunes&nbsp;!
        <br />
        <br />
        Vous avez entre 18 et 25 ans, habitez sur Paris, 92 ou 93 et remplissez
        toutes les conditions précédentes&nbsp;?
      </h4>
      <div className="uk-flex uk-flex-top uk-flex-center uk-padding-small">
        <Button
          style="secondary"
          className="uk-margin-small-top"
          isExternal
          newTab
          onClick={() => {
            return event(TAGS.PAGE_TRAVAILLER_DEPOSER_CANDIDATURE_CLIC);
          }}
          href={process.env.AIRTABLE_LINK_PROFESSIONAL_REINTEGRATION}
        >
          Je m&apos;inscris <IconNoSSR name="chevron-right" />
        </Button>
      </div>
      <p className="uk-text-center uk-text-italic">
        Nous étudierons votre candidature. Si votre profil correspond nous vous
        proposerons une rencontre pour valider votre participation au programme
        LinkedOut
      </p>
      <h4 className="uk-text-center uk-text-bold">
        Une prochaine promotion ouverte à tous aura lieu en septembre 2021 à{' '}
        <u>Paris</u>, <u>Lille</u> et <u>Lyon</u>.
      </h4>
      <p className="uk-text-center uk-margin-medium-top">
        <span className="uk-text-bold">
          <u>
            Hors de ces territoires LinkedOut ne pourra pas vous accompagner.
          </u>
        </span>
        <br />
        Nous en sommes désolés et nous faisons tout pour ouvrir rapidement de
        nouvelles antennes.
      </p>
      <h4 className="uk-text-center">
        Pour être tenu au courant des actualités sur projet, suivez l’aventure
        sur nos réseaux !
      </h4>
      <SharePartial padding={false} showTitle={false} />
    </Section>
  );
};

StepsToJoin.propTypes = {};

StepsToJoin.defaultProps = {};

export default StepsToJoin;
