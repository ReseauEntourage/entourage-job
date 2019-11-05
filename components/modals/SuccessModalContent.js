/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from '../utils/Icon';

const SuccessModalContent = ({ text, closeModal }) => (
  <div className="uk-flex uk-flex-center uk-margin-large">
    <div className="uk-card uk-card-body uk-text-center">
      <IconNoSSR name="check" ratio={4} className="uk-text-primary" />
      <p className="uk-text-lead">{text}</p>
      <button
        type="button"
        className="uk-button uk-button-primary"
        onClick={closeModal}
      >
        Fermer
      </button>
    </div>
  </div>
);
SuccessModalContent.propTypes = {
  text: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};
export default SuccessModalContent;
