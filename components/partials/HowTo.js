import React from 'react';
import PropTypes from 'prop-types';
import { ImgNoSSR } from '../utils';

const HowTo = ({ ccm }) => (
  <div className="uk-child-width-1-4@l uk-child-width-1-3@m uk-child-width-1-2@s uk-flex-center" data-uk-grid>
    {ccm.map((etape, index) => (
      <div className="uk-grid-item-match">
        <div className="uk-card" key={index}>
          <div className="uk-card-media-top uk-text-center">
            <img src={etape.imgSrc} alt={index + 1} />
          </div>
          <div className="uk-card-body">
            <div className="uk-flex">
              <div className="uk-width-1-6 uk-text-center">
                <h2 className="uk-h2 uk-text-primary uk-text-bold">{index + 1}</h2>
              </div>
              <div className="uk-width-5-6">{etape.description}</div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

HowTo.propTypes = {
  ccm: PropTypes.arrayOf(
    PropTypes.shape({
      imgSrc: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
};
HowTo.defaultProps = {
  ccm: {
    imgSrc: undefined,
    description: undefined,
  },
};

export default HowTo;
