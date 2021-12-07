import React from 'react';
import PropTypes from 'prop-types';
import { Modal, useModalContext } from 'src/components/modals/Modal';

const ModalGeneric = ({ children, resetForm }) => {
  const { onClose } = useModalContext();

  return (
    <Modal>
      <div className="uk-margin-auto-vertical">
        <div className="uk-modal-body uk-padding-large">
          {children(() => {
            onClose();
            resetForm();
          })}
        </div>
      </div>
    </Modal>
  );
};

ModalGeneric.propTypes = {
  children: PropTypes.func.isRequired,
  resetForm: PropTypes.func,
};

ModalGeneric.defaultProps = {
  resetForm: () => {},
};

export default ModalGeneric;
