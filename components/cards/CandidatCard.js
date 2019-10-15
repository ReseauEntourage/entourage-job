import React from 'react';
import PropTypes from 'prop-types';
import SimpleLink from '../utils';

const CandidatCard = ({ url, imgSrc, imgAlt, firstName, ambitions }) => (
  <SimpleLink href={`/cv/${url}`} className="uk-link-toggle">
    <div className="uk-cover-container uk-height-large uk-card uk-card-hover uk-border-rounded">
      <img src={imgSrc} alt={imgAlt} data-uk-cover />
      <div className="uk-overlay uk-overlay-primary uk-position-bottom uk-padding-small uk-text-center">
        <h3 className="uk-text-uppercase uk-margin-remove uk-text-bold">
          {firstName}
        </h3>
        <p className="uk-margin-small-top">
          A besoin d&apos;un coup de pouce pour travailler dans...
          <br />
          {ambitions.slice(0, 2).map((a, index) => {
            const separator = index + 1 < ambitions.length ? '. ' : '';
            return (
              <span key={index} className="uk-text-uppercase uk-text-bold">
                {a.name}
                {separator}
              </span>
            );
          })}
        </p>
        <p className="uk-text-bold">
          <u>Voir et partager son CV</u>
        </p>
      </div>
    </div>
  </SimpleLink>
);
CandidatCard.propTypes = {
  url: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  ambitions: PropTypes.arrayOf(PropTypes.shape).isRequired,
  imgSrc: PropTypes.string.isRequired,
  imgAlt: PropTypes.string.isRequired,
};

export default CandidatCard;
