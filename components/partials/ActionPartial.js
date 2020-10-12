import React from 'react';
import PropTypes from 'prop-types';
import { Section, GridNoSSR } from '../utils';
import { SharePartial } from './index';
import NewsletterPartial from './NewsletterPartial';
import MultipleCTA from './MultipleCTA';
import TAGS from '../../constants/tags';

const datas = [
  {
    button: {
      href: '/aider',
      label: 'Aider les candidats',
    },
    title: 'Vous êtes un particulier',
  },
  {
    button: {
      href: '/recruter',
      label: "S'engager dans l'inclusion",
    },
    title: 'Vous êtes une entreprise',
  },
  {
    button: {
      href: '/orienter',
      label: 'Orienter des candidats',
    },
    title: 'Vous êtes un acteur de l’insertion sociale ou professionnelle',
  },
  {
    button: {
      href: '/travailler',
      label: 'Rejoindre LinkedOut',
    },
    title: 'Vous cherchez du travail',
  },
];
const ActionPartial = ({ style }) => (
  <Section style={style} id="actions">
    <GridNoSSR gap="large" column>
      <div className="uk-text-center">
        <h2 className="uk-text-bold">
          <span className="uk-text-primary">Agissez</span> avec LinkedOut
        </h2>
        <p>
          Depuis son lancement en juin 2019, de belles rencontres ont emergé
          grâce aux multiples partages.
        </p>
      </div>

      <MultipleCTA
        data={datas}
        spacing="small"
        className="uk-margin-large-bottom"
      />
      <NewsletterPartial tag={TAGS.HOME_INSCRIPTION_NEWSLETTER_CLIC} />
      <SharePartial />
    </GridNoSSR>
  </Section>
);

ActionPartial.propTypes = {
  style: PropTypes.string,
};

ActionPartial.defaultProps = {
  style: 'default',
};

export default ActionPartial;
