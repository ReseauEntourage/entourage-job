import React from 'react';
import PropTypes from 'prop-types';
import { ImgNoSSR } from '../utils';

const CandidatCard = ({
  imgSrc,
  imgAlt,
  title,
  description,
  goods,
  ambitions,
}) => (
  <a className="uk-link-toggle" href="/profile">
    <div className="uk-card uk-card-hover uk-card-default">
      <div
        className="uk-card-media-top uk-height-max-medium"
        style={{ overflow: 'hidden' }}
      >
        <ImgNoSSR src={imgSrc} alt={imgAlt} />
      </div>
      <div className="uk-card-body">
        {/* <span className="uk-card-badge uk-label uk-label-warning">78</span> */}
        <h3 className="uk-card-title uk-link-heading">{title}</h3>
        <p>
          {description}
          <br />
          {goods.map((g, index) => {
            return (
              <span key={index}>
                <span className="uk-text-primary">{g}</span>
                {goods.length > index + 1 && <span> - </span>}
              </span>
            );
          })}
        </p>
        <p>
          Je souhaite travailler dans: <br />
          {ambitions.map((a, index) => {
            return (
              <span key={index}>
                <span className="uk-label">{a}</span>
                {ambitions.length > index + 1 && <span> </span>}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  </a>
);
CandidatCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  goods: PropTypes.arrayOf(PropTypes.string).isRequired,
  ambitions: PropTypes.arrayOf(PropTypes.string).isRequired,
  imgSrc: PropTypes.string.isRequired,
  imgAlt: PropTypes.string.isRequired,
};

export default CandidatCard;
