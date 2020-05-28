import React from 'react';
import Link from "next/link";
import {IconNoSSR, Section} from '../utils';
import {EXTERNAL_LINKS} from '../../constants';
import Button from "../utils/Button";

const StepsToJoin = () => {
  const content = [
    {
      description: <div>Vous remplissez le <span className="uk-text-bold">formulaire de candidature en ligne</span> cette plateforme</div>,
    },
    {
      description: <div>LinkedOut vous propose <span className="uk-text-bold">une rencontre pour faire votre connaissance</span> et vous expliquer le fonctionnement et les étapes du parcours</div>,
    },
    {
      description: <div><span className="uk-text-bold">Nous vous aidons réaliser un CV</span> plus humain, afin de valoriser vos atouts et de vous présenter tel que vous êtes</div>,
    },
    {
      description: <div><span className="uk-text-bold">Vous rencontrez toutes les semaines votre bénévole-coach</span> pour travailler ensemble votre recherche d’emploi</div>,
    },
    {
      description: <div>L’accompagnement de LinkedOut continue après la reprise d’un emploi ! Le bénévole-coach reste à vos côtés et un interlocuteur est disponible au sein de l’équipe Linkedout pour répondre à vos questions et faire le lien avec votre employeur si nécessaire</div>,
    },
  ];


  return (
    <Section container="small" id="stepToJoin" style="muted">
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
        Quelles sont <span className="uk-text-primary">les étapes</span> du parcours LinkedOut ?
      </h2>
      {/* TODO use grid */}
      <div className="uk-width-expand uk-flex uk-flex-wrap uk-flex-left uk-flex-center uk-flex-around">
        {content.map(({description}, index) => {
          return (
            <div key={index.toString()} className="uk-flex uk-flex-top uk-flex-left uk-width-medium uk-padding-small">
              <div className="uk-text-primary uk-text-large uk-text-bold">{index + 1}</div>
              <div className="uk-flex uk-padding-small uk-margin-small-top uk-flex uk-flex-top">
                {description}
              </div>
            </div>
          );
        })}
        <div className="uk-flex uk-flex-top uk-padding-small">
          <Button
            style="primary"
            className="uk-margin-medium-top"
            isExternal
            href={process.env.AIRTABLE_LINK_JOIN_LINKEDOUT}
          >Je candidate{' '}<IconNoSSR name="chevron-right" /></Button>
        </div>
        <h4 className="uk-text-center">
          Si vous avez des questions, écrivez-nous à{' '}
          <br />
          <a target='_blank' href="mailto:contact-linkedout@entourage.social">contact-linkedout@entourage.social</a></h4>
      </div>
    </Section>
  );
};

StepsToJoin.propTypes = {

};

StepsToJoin.defaultProps = {
};

export default StepsToJoin;
