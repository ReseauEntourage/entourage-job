import React from 'react';

const FormValidatorErrorMessage = ({ validObj }) => {
  if (validObj !== undefined) {
    return (
      <div className="uk-text-meta uk-text-danger">{validObj.message}</div>
    );
  }
  return null;
};

export default FormValidatorErrorMessage;
