import React from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = ({ error }) => {
  return (
    <div className="uk-width-1-1 uk-text-center">
      <div className="ukuk-width-xlarge">
        <h2 className="uk-text-bold uk-margin-remove">{error}</h2>
        <p>
          Contacte{' '}
          <span className="uk-text-primary">l&apos;équipe LinkedOut</span> pour
          en savoir plus.
        </p>
      </div>
    </div>
  );
};
ErrorMessage.propTypes = {
  error: PropTypes.string,
};
ErrorMessage.defaultProps = {
  error: undefined,
};
export default ErrorMessage;
