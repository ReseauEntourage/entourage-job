import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon';

const SuccessModalContent = ({ text, closeModal }) => {
  return (
    <>
      <div className="uk-text-center uk-flex uk-flex-column uk-flex-center">
        <IconNoSSR name="check" ratio={4} className="uk-text-primary" />
        {text}
      </div>
      <div className="uk-modal-footer uk-padding-remove-horizontal uk-padding-remove-bottom uk-margin-medium-top">
        <Button style="default" onClick={closeModal}>
          Fermer
        </Button>
      </div>
    </>
  );
};
SuccessModalContent.propTypes = {
  text: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};
export default SuccessModalContent;
