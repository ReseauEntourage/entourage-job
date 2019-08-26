import React from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR } from '../utils/Grid';

const HelpingCard = ({
  titleHead,
  titleMiddle,
  titleTail,
  description,
  img,
  alt,
}) => (
  <div className="uk-card uk-card-default uk-card-body">
    <GridNoSSR
      center
      childWidths={['1-1']}
      items={[
        <div className="uk-height-small uk-text-center">
          <img src={img} alt={alt} className="uk-height-1-1" />
        </div>,
        <div>
          <h3 className="uk-text-bold">
            {titleHead}
            <span className="uk-text-primary">{titleMiddle}</span>
            {titleTail}
          </h3>
        </div>,
      ]}
    />
    <p>{description}</p>
  </div>
);
HelpingCard.propTypes = {
  titleHead: PropTypes.string.isRequired,
  titleMiddle: PropTypes.string.isRequired,
  titleTail: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  alt: PropTypes.string,
};
HelpingCard.defaultProps = {
  alt: undefined,
};
export default HelpingCard;
