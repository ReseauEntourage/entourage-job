import React from 'react';
import PropTypes from 'prop-types';

const FormValidatorErrorMessage = ({ validObj }) => {
  if (validObj !== undefined) {
    return (
      <div className="uk-text-meta uk-text-danger">{validObj.message}</div>
    );
  }
  return null;
};

FormValidatorErrorMessage.propTypes = {
  validObj: PropTypes.shape(),
};

FormValidatorErrorMessage.defaultProps = {
  validObj: undefined,
};

export default FormValidatorErrorMessage;
