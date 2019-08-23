import React from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR } from './Grid';

import { IconNoSSR } from './Icon';

export const HelpingCard = ({
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

export const PresentationCard = ({ imgSrc, imgAlt, text }) => {
  const splited = text.split(' ');
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <div data-uk-grid>
        <div className="uk-width-1-1@s uk-width-small@m uk-flex uk-flex-center ">
          <img src={imgSrc} alt={imgAlt} className="uk-height-max-small" />
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

export const CandidatCard = ({
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
        <img alt={imgAlt} src={imgSrc} />
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

export const NumberCard = ({ value, description }) => (
  <div className="uk-card uk-card-body uk-card-small">
    <GridNoSSR
      childWidths={['1-2']}
      divider
      items={[
        <div className="uk-text-right uk-text-primary">
          <div className="uk-text-large">{value}</div>
          <IconNoSSR name="bolt" />
        </div>,
        <p>{description}</p>,
      ]}
    />
  </div>
);
NumberCard.propTypes = {
  value: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
};

export const ScaleCard = ({ title, titleEmphaseStart, description }) => {
  const arr = title.split(' ');
  const title1 = arr.slice(0, titleEmphaseStart).join(' ');
  const title2 = arr.slice(titleEmphaseStart).join(' ');
  return (
    <div className="uk-card uk-height-1-1 uk-card-default uk-card-body">
      <h3>
        <span>{title1} </span>
        <span className="uk-text-primary">{title2}</span>
      </h3>
      <p>{description}</p>
    </div>
  );
};
ScaleCard.propTypes = {
  title: PropTypes.string.isRequired,
  titleEmphaseStart: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
};
