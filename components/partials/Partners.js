import React from 'react';
import {Background, IconNoSSR, Section} from '../utils';
import Grid from "../utils/Grid";
import PARTNERS from '../../constants/partners';
import SimpleLink from "../utils/SimpleLink";
import {event} from "../../lib/gtag";
import TAGS from "../../constants/tags";
import Button from "../utils/Button";

const Partners = () => {

  const logoList = (data) => {
    return (
      <Grid
        childWidths={[`1-4@m`, 'auto']}
        match
        middle
        center
        gap='small'
        items={data.map(({key, link}) => {
          return (
            <SimpleLink
              className="uk-flex uk-flex-center"
              isExternal
              target="_blank"
              onClick={() => event(TAGS.FOOTER_PARTENAIRE_CLIC)}
              href={link}>
              <div className="uk-background-center-center uk-background-contain uk-width-small uk-height-small" style={{maxHeight: 100, backgroundImage: `url(/static/img/partners/${key}/logo.png)`}} />
            </SimpleLink>
          );
        })}
      />
    );
  };

  return (
    <Background blend={{colorHex: '#484848'}}>
      <Section container="large">
        <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
          <h2
            style={{color: '#fff'}}
            className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
            <span className="uk-text-primary">Les partenaires</span> du projet LinkedOut
          </h2>
          <div className="uk-background-default uk-padding-large">
            <h4
              className="uk-text-primary uk-text-bold">
              Ce projet est développé en partenariat avec
            </h4>
            {logoList(PARTNERS.strategy)}
            <h4
              className="uk-text-primary uk-text-bold uk-margin-large-top">
              Avec le soutien précieux de
            </h4>
            {logoList(PARTNERS.finance)}
            <div className="uk-flex uk-flex-center uk-flex-middle uk-margin-large-top">
              <Button style="primary" href="/partenaires">
                En savoir plus{' '}&nbsp;<IconNoSSR name="arrow-right" />
              </Button>
            </div>

          </div>
        </div>
      </Section>
    </Background>
  )
};

export default Partners;
