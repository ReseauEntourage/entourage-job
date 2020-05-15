import React from 'react';
import PropTypes from "prop-types";
import { IconNoSSR, GridNoSSR } from '../utils';

const ContactPartial = ({ title, submitLabel, padding }) => (
  <div id="profiles" className={!padding ? 'uk-padding-remove-vertical' : ''}>
    <div className="uk-text-center">
      {title}
    </div>
    {/* input */}
    <div className="uk-flex uk-flex-center">
      <GridNoSSR
        eachWidths={['expand', 'auto']}
        className="uk-width-1-2@s"
        gap="collapse"
      >
        <div data-uk-form-custom="target: true" className="uk-width-1-1">
          <a className="uk-form-icon" disabled>
            <IconNoSSR name="mail" />
          </a>
          <input
            className="uk-input"
            type="text"
            placeholder="Votre adresse mail..."
            style={{ borderBottom: 0, borderRadius: '2px 0 0 2px' }}
          />
        </div>
        <button
          type="button"
          className="uk-button uk-button-primary"
          style={{
            color: 'white',
            backgroundColor: '#F55F24',
            backgroundImage: 'none',
            textTransform: 'none',
            boder: null,
            padding: '0px 20px',
            borderRadius: '2px',
          }}
        >
          {submitLabel}
        </button>
      </GridNoSSR>
    </div>
  </div>
);

ContactPartial.propTypes = {
  title: PropTypes.element.isRequired,
  submitLabel: PropTypes.string.isRequired,
  padding: PropTypes.bool
};

ContactPartial.defaultProps = {
  padding: true
};

export default ContactPartial;
