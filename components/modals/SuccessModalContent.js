/* eslint-disable no-undef */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from '../utils/Icon';
import { Button } from "../utils";
import { ModalContext } from '../store/ModalProvider';

const SuccessModalContent = ({ text }) => {
  const {
    close,
    setClose,
  } = useContext(ModalContext);

  return (
    <div className="uk-flex uk-flex-center uk-margin-large">
      <div className="uk-card uk-card-body uk-text-center">
        <IconNoSSR name="check" ratio={4} className="uk-text-primary" />
        <p className="uk-text-lead">{text}</p>
        <Button
          style="primary"
          onClick={() => setClose(close)}
        >
          Fermer
      </Button>
      </div>
    </div>
  )
};
SuccessModalContent.propTypes = {
  text: PropTypes.string.isRequired,
};
export default SuccessModalContent;
