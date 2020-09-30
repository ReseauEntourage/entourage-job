import React from 'react';
import PropTypes from 'prop-types';
import { Section, GridNoSSR } from '../utils';
import {SharePartial} from "./index";
import ContactPartial from "./ContactPartial";
import MultipleCTA from "./MultipleCTA";

const datas = [
  {
    button: {
      href: '/aider',
      label: 'Aider les candidats',
    },
    title: 'Je suis un particulier',
  },
  {
    button: {
      href: '/recruter',
      label: 'Recruter des candidats'
    },
    title: 'S\'engager dans l\'inclusion',
  },
  {
    button: {
      href: '/orienter',
      label: 'Orienter des candidats'
    },
    title: 'Je suis un acteur de l’insertion sociale ou professionnelle',
  },
  {
    button: {
      href: '/travailler',
      label: 'Rejoindre LinkedOut',
    },
    title: 'Je cherche du travail',
  },
];
const ActionPartial = ({ style }) => (
  <Section style={style} id="actions">
    <GridNoSSR gap="large" column>
      <div className="uk-text-center">
        <h2 className="uk-text-bold">
          <span className="uk-text-primary">J&apos;agis</span> avec LinkedOut
        </h2>
        <p>
          Depuis son lancement en juin 2019, de belles rencontres ont emergé
          grâce aux multiples partages.
        </p>
      </div>

      <MultipleCTA
        data={datas}
        spacing='small'
        className="uk-margin-large-bottom" />
      <ContactPartial />
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
