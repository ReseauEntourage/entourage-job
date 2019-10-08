import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const CandidatCard = ({
  url,
  imgSrc,
  imgAlt,
  title,
  description,
  ambitions,
}) => (
  <Link href={`/cv/${url}`}>
    <a className="uk-link-toggle" href="/profile">
      <div className="uk-cover-container uk-height-large uk-card uk-card-hover">
        <img src={imgSrc} alt={imgAlt} data-uk-cover />
        <div className="uk-overlay uk-overlay-primary uk-position-bottom uk-padding-small uk-text-center">
          <h3 className="uk-text-uppercase uk-margin-remove">{title}</h3>
          <p className="uk-margin-small-top">
            {description}
            <br />
            {ambitions.map((a, index) => {
              return (
                <span key={index}>
                  <span className="uk-text-uppercase uk-text-bold">{a}.</span>
                  {ambitions.length > index + 1 && <span> </span>}
                </span>
              );
            })}
          </p>
          <p>
            <u>Voir le CV</u>
          </p>
        </div>
      </div>
    </a>
  </Link>
);
CandidatCard.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  ambitions: PropTypes.arrayOf(PropTypes.string).isRequired,
  imgSrc: PropTypes.string.isRequired,
  imgAlt: PropTypes.string.isRequired,
};

export default CandidatCard;
