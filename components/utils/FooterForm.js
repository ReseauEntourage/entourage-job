import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import { GridNoSSR } from '.';

const FooterForm = ({ error, onSubmit, onCancel, submitText }) => {
  return (
    <>
      {error && (
        <div className="uk-width-1-1">
          <span
            className="uk-text-danger uk-margin-right"
            style={{ alignSelf: 'center' }}
          >
            {error}
          </span>
        </div>
      )}
      <GridNoSSR
        className="uk-margin uk-grid-small"
        between
        childWidths={['auto']}
        items={[
          <div className="uk-width-auto@s">
            <span className="uk-text-meta" style={{ alignSelf: 'center' }}>
              * : Mentions obligatoires
            </span>
          </div>,
          <div className="uk-text-right">
            <GridNoSSR
              className="uk-grid-small"
              items={[
                onCancel ? (
                  <Button style="default" onClick={onCancel}>
                    Annuler
                  </Button>
                ) : (
                  <></>
                ),
                <Button style="primary" onClick={onSubmit}>
                  {submitText || 'Envoyer'}
                </Button>,
              ]}
            />
          </div>,
        ]}
      />
    </>
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
