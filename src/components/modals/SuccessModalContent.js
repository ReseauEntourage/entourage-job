import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon';

const SuccessModalContent = ({ text, closeModal }) => {
  return (
    <div className="uk-text-center ">
      <IconNoSSR name="check" ratio={4} className="uk-text-primary" />
      <p className="uk-text-lead">{text}</p>
      <div className="uk-flex uk-flex-right uk-margin-medium-top">
        <Button style="primary" onClick={closeModal}>
          Fermer
        </Button>
      </div>
    </div>
  );
};
SuccessModalContent.propTypes = {
  text: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};
export default SuccessModalContent;
