import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import { GridNoSSR } from '.';

const FooterForm = ({ error, onSubmit, onCancel }) => {
  return (
    <>
      {error ? (
        <div className="uk-width-1-3@m">
          <span
            className="uk-text-danger uk-margin-right"
            style={{ alignSelf: 'center' }}
          >
            {error}
          </span>
        </div>
      ) : (
        <></>
      )}
      <GridNoSSR
        className="uk-margin uk-grid-small"
        childWidths={['1-2']}
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
                <Button style="default" onClick={onCancel}>
                  Annuler
                </Button>,
                <Button style="primary" onClick={onSubmit}>
                  Envoyer
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
};

FooterForm.defaultProps = {
  error: undefined,
  onCancel: () => {},
};

export default FooterForm;
