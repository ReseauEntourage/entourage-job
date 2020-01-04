import React from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR } from '../utils/Grid';

// todo: les cartes sont un petit peu decallés à cause du jeu expand auto
// recentrer les cartes
const NumberCard = ({ value, description }) => (
  <div className="uk-card uk-card-body uk-card-small">
    <GridNoSSR
      middle
      center
      gap="small"
      eachWidths={['auto', 'auto', 'expand']}
      items={[
        <div className="uk-text-right uk-text-primary">
          <span className="uk-h1 uk-text-primary">{value}</span>
        </div>,
        <hr
          className="uk-divider-vertical"
          style={{ borderLeftColor: '#F55F24', height: '80px' }}
        />,
        <p>{description}</p>,
      ]}
    />
  </div>
);
NumberCard.propTypes = {
  value: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
};
export default NumberCard;
