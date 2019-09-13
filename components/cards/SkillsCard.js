import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from '../utils/Icon';

const SkillCard = ({ list }) => {
  return (
    <div className="uk-card uk-card-secondary uk-card-body">
      <h3 className="uk-card-title">
        <span className="uk-margin-small-right">
          <IconNoSSR name="bolt" />
        </span>
        Mes atouts
      </h3>
      <ul className="uk-list">
        {list.map((item, i) => (
          <li id={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
};
SkillCard.propTypes = {
  list: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default SkillCard;
