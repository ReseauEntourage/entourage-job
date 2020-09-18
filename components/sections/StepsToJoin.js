import React from 'react';
import Link from "next/link";
import {IconNoSSR, Section} from '../utils';
import {EXTERNAL_LINKS} from '../../constants';
import Button from "../utils/Button";
import Grid from "../utils/Grid";
import MultipleCTA from "../partials/MultipleCTA";
import {event} from "../../lib/gtag";
import TAGS from "../../constants/tags";

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
      <h4 className="uk-text-bold uk-text-center uk-margin-large-top">
        La promotion LinkedOut est complète pour 2020. Nous étudierons à nouveau les candidatures pour le lancement de la prochaine promotion en avril 2021 à Paris, dans le 92, le 93 et à Lille.
      </h4>
      <div className="uk-flex uk-flex-top uk-flex-center uk-padding-small">
        <Button
          style="secondary"
          className="uk-margin-small-top"
          isExternal
          onClick={() => event(TAGS.PAGE_TRAVAILLER_DEPOSER_CANDIDATURE_CLIC)}
          href={process.env.AIRTABLE_LINK_JOIN_LINKEDOUT}>
          Rejoindre LinkedOut{' '}<IconNoSSR name="chevron-right" />
        </Button>
      </div>
      <p className="uk-text-center">
        Si vous avez des questions, écrivez-nous à{' '}
        <br />
        <a
          className="uk-link-text uk-text-primary"
          target='_blank'
          rel="noopener"
          href={`mailto:${process.env.MAILJET_CONTACT_EMAIL}`}
        >
          {process.env.MAILJET_CONTACT_EMAIL}
        </a>
        {' '}ou appelez nous au{' '}
        <a
          className="uk-link-text uk-text-primary"
          target='_blank'
          rel="noopener"
          href={`tel:${'0176420535'}`}
        >
          01&nbsp;76&nbsp;42&nbsp;05&nbsp;35
        </a>
      </p>
    </Section>
  );
};

StepsToJoin.propTypes = {

};

StepsToJoin.defaultProps = {
};

export default StepsToJoin;
