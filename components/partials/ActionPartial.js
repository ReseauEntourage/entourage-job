import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Section, GridNoSSR, IconNoSSR } from '../utils';
import {SharePartial} from "./index";
import ContactPartial from "./ContactPartial";
import Button from "../utils/Button";

const datas = [
  {
    href: '/jeveuxtravailler',
    button: 'Je veux travailler',
    title: 'Je suis en galère',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium nam itaque soluta ad officiis minima! Ea inventore saepe quam accusamus?',
  },
  {
    href: '/jeveuxaider',
    button: 'Je veux aider',
    title: 'Je suis un particulier ou un acteur du social',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium nam itaque soluta ad officiis minima! Ea inventore saepe quam accusamus?',
  },
  {
    href: '/jeveuxrecruter',
    button: 'Je veux recruter',
    title: 'Découvrez les profils des candidats',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium nam itaque soluta ad officiis minima! Ea inventore saepe quam accusamus?'
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

      <div uk-height-match="target : h3">
        <GridNoSSR
          childWidths={['1-3@s']}
          middle
          gap="large"
          items={datas.map((value, index) => (
            <GridNoSSR
              // uk-width-medium@s
              className="uk-text-center"
              gap="small"
              middle
              column
              key={index.toString()}
            >
              <h3>{value.title}</h3>
              <hr style={{ borderTopColor: '#F55F24', width: '100px' }} />
              {value.description && <p>{value.description}</p>}
              <Button
                href={value.href}
                style='primary'>
                {value.button}{' '}<IconNoSSR name="chevron-right" />
              </Button>
            </GridNoSSR>
          ))}
        />
      </div>
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
