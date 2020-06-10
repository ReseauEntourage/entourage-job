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
      href: '/jeveuxaider',
      label: 'Je veux aider',
    },
    title: 'Je suis un particulier ou un acteur du social',
    text: 'Il n\'y a pas de petit coup de pouce, aidez à votre échelle\xa0!',
  },
  {
    button: {
      href: '/jeveuxrecruter',
      label: 'Je veux recruter'
    },
    title: 'Découvrez les profils des candidats',
    text: 'La précarité et l\'exclusion n\'empêchent pas le talent\xa0!'
  },
  {
    button: {
      href: '/jeveuxtravailler',
      label: 'Je veux travailler',
    },
    title: 'Je suis en galère',
    text: 'LinkedOut s’adresse à toute personne en situation d’exclusion ou de précarité, dans une démarche d’insertion professionnelle, motivée et en capacité de travailler.',
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
          Depuis son lancement en juin 2019, de belles rencontres ont emmergé
          grace aux multiples partages.
        </p>
      </div>

      <MultipleCTA data={datas} showHorizontalDividers/>
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
