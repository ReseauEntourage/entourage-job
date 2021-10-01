import React from 'react';
import PropTypes from 'prop-types';
import { Img } from 'src/components/utils';
import { addPrefix } from 'src/utils';
import moment from 'moment';

const CVBackground = ({ url, employed, endOfContract }) => {
  const employedBadgeContent = (
    <>
      <div className="uk-flex uk-flex-center uk-flex-middle uk-margin-small-right">
        <Img
          width="17px"
          height="25px"
          src="/static/img/logo-white.png"
          alt="logo entourage"
        />
      </div>
      <div className="uk-text-uppercase uk-text-bold uk-text-primary">
        &nbsp;{' '}
        {endOfContract
          ? `en emploi jusqu'au ${moment(endOfContract).format('DD/MM/YYYY')}`
          : 'a retrouvé un emploi'}
      </div>
    </>
  );

  const colorClass = endOfContract ? 'ent-temp-employed-color' : '';

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
          <div
            className={`uk-visible@m ent-employed-badge ${colorClass} uk-flex uk-flex-center uk-flex-middle uk-light uk-box-shadow-large`}
          >
            {employedBadgeContent}
          </div>
          <div
            className={`uk-hidden@m ent-employed-badge-small ${colorClass} uk-flex uk-flex-center uk-flex-middle uk-light uk-box-shadow-large`}
          >
            {employedBadgeContent}
          </div>
        </div>
      )}
      <div
        className="uk-background-cover uk-background-center uk-box-shadow-small"
        style={{
          backgroundImage: `url("${addPrefix(url)}")`,
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
};
CVBackground.propTypes = {
  url: PropTypes.string,
  employed: PropTypes.bool,
  endOfContract: PropTypes.string,
};
CVBackground.defaultProps = {
  url: '/static/img/arthur-background.jpg',
  employed: false,
  endOfContract: undefined,
};

export default CVBackground;
