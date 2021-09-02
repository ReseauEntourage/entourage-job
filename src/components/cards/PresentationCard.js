import React from 'react';
import PropTypes from 'prop-types';
import { Img } from 'src/components/utils';

const PresentationCard = ({ imgSrc, imgAlt, text }) => {
  const splited = text.split(' ');
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <div data-uk-grid>
        <div className="uk-width-1-1@s uk-width-small@m uk-flex uk-flex-center ">
          <Img src={imgSrc} alt={imgAlt} className="uk-height-max-small" />
        </div>
        <div className="uk-width-expand">
          <p className="uk-text-uppercase uk-text-center uk-text-left@m">
            <span className="uk-text-bold uk-text-primary">{splited[0]} </span>
            <span className="uk-text-bold">{splited[1]} </span>
            <br />
            <span>{splited.slice(2).join(' ')}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
PresentationCard.propTypes = {
  text: PropTypes.string.isRequired,
  imgSrc: PropTypes.string.isRequired,
  imgAlt: PropTypes.string.isRequired,
};
export default PresentationCard;
