import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from '../utils/Icon';

const PassionsCard = ({ list }) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <h3 className="uk-card-title">
        <span className="uk-margin-small-right">
          <IconNoSSR name="heart" />
        </span>
        Mes passions
      </h3>
      <ul className="uk-list">
        {list.map((item, i) => (
          <li id={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
};
PassionsCard.propTypes = {
  list: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default PassionsCard;
