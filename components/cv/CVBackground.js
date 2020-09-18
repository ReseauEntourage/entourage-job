import React from 'react';
import PropTypes from 'prop-types';
import {ImgNoSSR} from "../utils";

const CVBackground = ({ url, employed }) => {

  const employedBadgeContent = (
    <>
      <div className="uk-flex uk-flex-center uk-flex-middle uk-margin-small-right">
        <ImgNoSSR
          width="17px"
          height="25px"
          src="/static/img/logo-white.png"
          alt="logo entourage"
        />
      </div>
      <div className="uk-text-uppercase uk-text-bold uk-text-primary">
        &nbsp;{' '}a retrouvé un emploi
      </div>
    </>
  );

  return (
    <div
      className="uk-container"
      style={{
        position: 'relative',
        minHeight: '220px',
        maxHeight: '400px',
        height: '50vw',
      }}
    >
      {employed && (
        <div className="ent-employed-container uk-width-large uk-height-large uk-overflow-hidden uk-position-z-index uk-flex uk-flex-center uk-flex-middle">
          <div className="uk-visible@m ent-employed-badge uk-flex uk-flex-center uk-flex-middle uk-light uk-box-shadow-large">
            {employedBadgeContent}
          </div>
          <div className="uk-hidden@m ent-employed-badge-small uk-flex uk-flex-center uk-flex-middle uk-light uk-box-shadow-large">
            {employedBadgeContent}
          </div>
        </div>
      )}
      <div
        className="uk-background-cover uk-background-center uk-box-shadow-small"
        style={{
          backgroundImage: `url("${url}")`,
          backgroundPosition: 'center 55%',
          position: 'absolute',
          right: 0,
          top: 0,
          left: 0,
          display: 'block',
          width: '100%',
          minHeight: '140%',
          maxHeight: '140%',
          height: '70vw',
        }}
      />
    </div>
  );
}
CVBackground.propTypes = {
  url: PropTypes.string,
  employed: PropTypes.bool
};
CVBackground.defaultProps = {
  url: '/static/img/arthur-background.jpg',
  employed: false
};

export default CVBackground;
