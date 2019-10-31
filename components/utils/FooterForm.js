import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const FooterForm = ({ error, onSubmit, onCancel }) => {
  return (
    <div className="uk-margin-medium-top">
      <div className="uk-flex uk-flex-right uk-width-1-1 uk-margin">
        <span
          className="uk-text-meta uk-flex-auto uk-margin-left"
          style={{ alignSelf: 'center' }}
        >
          * : Mentions obligatoires
        </span>
        <span
          className="uk-text-danger uk-margin-right"
          style={{ alignSelf: 'center' }}
        >
          {error}
        </span>
        <Button style="default" className="uk-margin-right" onClick={onCancel}>
          Annuler
        </Button>
        <Button style="primary" onClick={onSubmit}>
          Envoyer
        </Button>
      </div>
    </div>
  );
};

FooterForm.propTypes = {
  error: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

FooterForm.defaultProps = {
  error: undefined,
};

export default FooterForm;
