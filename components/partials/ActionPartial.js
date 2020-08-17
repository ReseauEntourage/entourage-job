import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Section, GridNoSSR, IconNoSSR } from '../utils';
import {SharePartial} from "./index";
import ContactPartial from "./ContactPartial";
import Button from "../utils/Button";
import MultipleCTA from "./MultipleCTA";

const datas = [
  {
    button: {
      href: '/aider',
      label: 'Je veux aider',
    },
    title: 'Je suis un particulier ou un acteur du social',
  },
  {
    button: {
      href: '/recruter',
      label: 'Je veux recruter'
    },
    title: 'Découvrez les profils des candidats',
  },
  {
    button: {
      href: '/travailler',
      label: 'Je veux travailler',
    },
    title: 'Je suis en galère',
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

      <MultipleCTA data={datas} className="uk-margin-large-bottom" />
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
