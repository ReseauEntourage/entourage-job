/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from '../utils/Icon';
import {Button} from "../utils";

const SuccessModalContent = ({ text, closeModal }) => (
  <div className="uk-flex uk-flex-center uk-margin-large">
    <div className="uk-card uk-card-body uk-text-center">
      <IconNoSSR name="check" ratio={4} className="uk-text-primary" />
      <p className="uk-text-lead">{text}</p>
      <div className="uk-flex uk-flex-center">
        <Button
          style="primary"
          onClick={closeModal}
        >
          Fermer
        </Button>
      </div>
    </div>
  </div>
);
SuccessModalContent.propTypes = {
  text: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};
export default SuccessModalContent;
