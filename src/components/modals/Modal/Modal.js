import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { useModalContext } from './ModalContext';

Modal.setAppElement('#__next');

const CustomModal = ({ children, closeOnNextRender }) => {
  const { onClose } = useModalContext();

  useEffect(() => {
    if (closeOnNextRender && onClose) {
      onClose();
    }
  }, [closeOnNextRender, onClose]);

  return (
    <Modal
      style={{
        overlay: {
          zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          left: 'auto',
          right: 'auto',
          borderRadius: 0,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
        },
      }}
      shouldCloseOnOverlayClick={false}
      isOpen
      onRequestClose={(event, reason) => {
        if (reason === 'backdropClick') {
          return;
        }
        onClose();
      }}
    >
      {children}
    </Modal>
  );
};

CustomModal.propTypes = {
  children: PropTypes.element.isRequired,
  closeOnNextRender: PropTypes.bool,
};

CustomModal.defaultProps = {
  closeOnNextRender: false,
};

export { CustomModal as Modal };
