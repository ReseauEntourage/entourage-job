import React from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR } from '../utils/Grid';
import { IconNoSSR } from '../utils/Icon';

const NumberCard = ({ value, description }) => (
  <div className="uk-card uk-card-body uk-card-small">
    <GridNoSSR
      childWidths={['1-2']}
      divider
      items={[
        <div className="uk-text-right uk-text-primary">
          <div className="uk-text-large">{value}</div>
          <IconNoSSR name="bolt" />
        </div>,
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
