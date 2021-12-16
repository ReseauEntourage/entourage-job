import React from 'react';
import PropTypes from 'prop-types';
import Button from 'src/components/utils/Button';

const FooterForm = ({ error, onSubmit, onCancel, submitText }) => {
  return (
    <div className="uk-flex uk-flex-column uk-flex-left">
      {error && (
        <div className="uk-flex uk-flex-1">
          <span className="uk-text-danger uk-margin-small-bottom">{error}</span>
        </div>
      )}
      <div className="uk-flex uk-flex-1 uk-flex-column">
        <div className="uk-width-auto@s">
          <span className="uk-text-meta">* : Mentions obligatoires</span>
        </div>
        <div className="uk-modal-footer uk-text-right uk-margin-medium-top">
          <div className="uk-flex uk-flex-right uk-flex-middle uk-flex-wrap-reverse">
            {onCancel && (
              <div>
                <Button style="default" onClick={onCancel}>
                  Annuler
                </Button>
              </div>
            )}
            <div style={{ marginLeft: 15 }}>
              <Button style="primary" onClick={onSubmit}>
                {submitText || 'Envoyer'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FooterForm.propTypes = {
  error: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string,
};

FooterForm.defaultProps = {
  error: undefined,
  onCancel: undefined,
  submitText: undefined,
};

export default FooterForm;
