import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from '../utils/Icon';

const InfoProfileCard = ({
  contract,
  location,
  availability,
  language,
  transport,
}) => {
  let formatContract = '';
  contract.forEach((c, index) => {
    const separator = index + 1 < contract.length ? ' / ' : '';
    formatContract += `${c}${separator}`;
  });
  let formatLanguage = '';
  language.forEach((l, index) => {
    const separator = index + 1 < language.length ? ' / ' : '';
    formatLanguage += `${l}${separator}`;
  });

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
          <IconNoSSR name="file-text" /> {formatContract}
        </li>
        <li>
          <IconNoSSR name="location" /> {location}
        </li>
        <li>
          <IconNoSSR name="calendar" /> {availability}
        </li>
        <li>
          <IconNoSSR name="users" /> {formatLanguage}
        </li>
        <li>
          <IconNoSSR name="hashtag" /> {transport}
        </li>
      </ul>
    </div>
  );
};
InfoProfileCard.propTypes = {
  contract: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.string,
  availability: PropTypes.string,
  language: PropTypes.arrayOf(PropTypes.string),
  transport: PropTypes.string,
};

InfoProfileCard.defaultProps = {
  contract: ['Type de contrat recherché non renseigné'],
  location: 'Localisation non renseigné',
  availability: 'Disponibilité non renseigné',
  language: ['Langues apprises non renseigné'],
  transport: 'Moyen de transport non renseigné',
};

export default InfoProfileCard;
