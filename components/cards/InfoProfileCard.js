import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from '../utils/Icon';

const InfoProfileCard = ({
  contract,
  location,
  availability,
  language,
  transport,
  onChange,
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
      <div className="uk-flex-inline uk-width-1-1">
        <h3 className="uk-card-title">
          {!onChange && (
            <span className="uk-margin-small-right">
              <IconNoSSR name="info" />
            </span>
          )}
          Infos pratiques
        </h3>
        {onChange && (
          <h3 className="uk-card-title uk-align-right uk-text-right uk-width-expand">
            <button type="button" className="uk-button uk-button-text">
              <IconNoSSR name="pencil" ratio={1.5} />
            </button>
          </h3>
        )}
      </div>
      <ul className="uk-list">
        <li>
          <IconNoSSR name="file-text" />{' '}
          {formatContract !== ''
            ? formatContract
            : 'Type de contrat recherché non renseigné'}
        </li>
        <li>
          <IconNoSSR name="location" />{' '}
          {location !== '' ? location : 'Localisation non renseigné'}
        </li>
        <li>
          <IconNoSSR name="calendar" />{' '}
          {availability !== '' ? availability : 'Disponibilité non renseigné'}
        </li>
        <li>
          <IconNoSSR name="users" />{' '}
          {formatLanguage !== ''
            ? formatLanguage
            : 'Langues apprises non renseigné'}
        </li>
        <li>
          <IconNoSSR name="hashtag" />{' '}
          {transport !== '' ? transport : 'Moyen de transport non renseigné'}
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
  onChange: PropTypes.func,
};

InfoProfileCard.defaultProps = {
  contract: ['Type de contrat recherché non renseigné'],
  location: 'Localisation non renseigné',
  availability: 'Disponibilité non renseigné',
  language: ['Langues apprises non renseigné'],
  transport: 'Moyen de transport non renseigné',
  onChange: null,
};

export default InfoProfileCard;
