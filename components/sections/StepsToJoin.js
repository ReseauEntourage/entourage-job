import React from 'react';
import Link from "next/link";
import {IconNoSSR, Section} from '../utils';
import {EXTERNAL_LINKS} from '../../constants';
import Button from "../utils/Button";
import Grid from "../utils/Grid";
import MultipleCTA from "../partials/MultipleCTA";

const StepsToJoin = () => {
  const content = [
    {
      img: '/static/img/illustrations/work1.png',
      text: <div><span className="uk-text-bold">Nous vous aidons à réaliser un CV</span> plus humain, afin de valoriser vos atouts et de vous présenter tel que vous êtes</div>,
    },
    {
      img: '/static/img/illustrations/work2.png',
      text: <div><span className="uk-text-bold">Vous rencontrez toutes les semaines votre bénévole-coach</span> pour travailler ensemble votre recherche d’emploi</div>,
    },
    {
      img: '/static/img/illustrations/work3.png',
      text: <div>Vous êtes soutenu(e) <span className="uk-text-bold">lors de votre reprise d&apos;emploi</span> et durant les premiers mois de votre arrivée en entreprise</div>,
    },
  ];


  return (
    <Section container="small" id="stepsToJoin" style="muted">
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
        Quelles sont <span className="uk-text-primary">les étapes</span> du parcours LinkedOut ?
      </h2>
      <MultipleCTA data={content} showNumbers animate/>
      <div className="uk-flex uk-flex-top uk-flex-center uk-padding-small">
        <Button
          style="secondary"
          className="uk-margin-medium-top"
          isExternal
          href={process.env.AIRTABLE_LINK_JOIN_LINKEDOUT}
        >Candidater{' '}<IconNoSSR name="chevron-right" /></Button>
      </div>
      <h4 className="uk-text-center">
        Si vous avez des questions, écrivez-nous à{' '}
        <br />
        <a
          className="uk-link-text uk-text-primary"
          target='_blank'
          rel="noopener noreferrer"
          href={`mailto:${process.env.MAILJET_CONTACT_EMAIL}`}
        >
          {process.env.MAILJET_CONTACT_EMAIL}
        </a>
      </h4>
    </Section>
  );
};

StepsToJoin.propTypes = {

};

StepsToJoin.defaultProps = {
};

export default StepsToJoin;
