import React from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = ({ error }) => (
  <div className="uk-width-1-1" data-uk-height-viewport="expand: true">
    <div
      className="uk-position-absolute uk-transform-center uk-text-center"
      style={{ left: '50%', top: '50%' }}
    >
      <div className="ukuk-width-xlarge">
        <h2 className="uk-text-bold uk-margin-remove">{error}</h2>
        <p>
          Contacte{' '}
          <span className="uk-text-primary">l&apos;équipe LinkedOut</span> pour
          en savoir plus.
        </p>
      </div>
    </div>
  </div>
);
ErrorMessage.propTypes = {
  error: PropTypes.string,
};
ErrorMessage.defaultProps = {
  error: undefined,
};
export default ErrorMessage;
