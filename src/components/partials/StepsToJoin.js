import React from 'react';
import { Section } from 'src/components/utils';
import Button from 'src/components/utils/Button';
import { event } from 'src/lib/gtag';
import TAGS from 'src/constants/tags';
import { SharePartial } from 'src/components/partials/index';
import { IconNoSSR } from 'src/components/utils/Icon';

const StepsToJoin = () => {
  return (
    <Section container="small" id="stepsToJoin" style="default">
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
        Comment <span className="uk-text-primary">s&apos;inscrire&nbsp;?</span>
      </h2>
      <h4 className="uk-text-bold uk-text-center uk-margin-large-top">
        Vous répondez aux critères ci dessus&nbsp;? Envoyez nous votre
        candidature&nbsp;!
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
        LinkedOut&nbsp;!
      </p>
      <p className="uk-text-center uk-margin-medium-top">
        <span className="uk-text-bold">
          <u>
            Attention, hors de Paris, Lille, Lyon, Seine-Saint-Denis et
            Haut-de-Seine, nous ne pourrons vous accompagner.
          </u>
        </span>
        <br />
        Nous en sommes désolés et nous faisons tout pour ouvrir rapidement de
        nouvelles antennes.
      </p>
      <h4 className="uk-text-center uk-margin-large-top">
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
