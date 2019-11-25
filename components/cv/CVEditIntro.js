import React from 'react';
import PropTypes from 'prop-types';

const CVEditIntro = ({ intro }) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <h3 className="uk-card-title">
        <span className="uk-text-bold">
          Description - Phrase d&apos;accroche
        </span>
        <br />
        (x caractères max)
      </h3>
      {intro ? (
        <p>{intro}</p>
      ) : (
        <p className="uk-text-italic">
          Aucune phrase d&apos;accroche n&apos;a encore été créé
        </p>
      )}
    </div>
  );
};
CVEditIntro.propTypes = {
  intro: PropTypes.string.isRequired,
};
export default CVEditIntro;
