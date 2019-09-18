import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from '../utils/Icon';

const InfoProfileCard = ({ contrat, location, period, language, car }) => {
  return (
    <div className="uk-card uk-card-primary uk-card-body">
      <h3 className="uk-card-title">
        <span className="uk-margin-small-right">
          <IconNoSSR name="info" />
        </span>
        Infos pratiques
      </h3>
      <ul className="uk-list">
        <li>
          <IconNoSSR name="file-text" /> {contrat}
        </li>
        <li>
          <IconNoSSR name="location" /> {location}
        </li>
        <li>
          <IconNoSSR name="calendar" /> {period}
        </li>
        <li>
          <IconNoSSR name="users" /> {language}
        </li>
        <li>
          <IconNoSSR name="cart" /> {car}
        </li>
      </ul>
    </div>
  );
};
InfoProfileCard.propTypes = {
  contrat: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  period: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  car: PropTypes.string.isRequired,
};
export default InfoProfileCard;
