import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { useModalContext } from 'src/components/modals/Modal/ModalContext';

Modal.setAppElement('#__next');

const CustomModal = ({ children, closeOnNextRender, className }) => {
  const { onClose } = useModalContext();

  useEffect(() => {
    if (closeOnNextRender && onClose) {
      onClose();
    }
  }, [closeOnNextRender, onClose]);

  return (
    <Modal
      closeTimeoutMS={200}
      style={{
        overlay: {
          zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,.6)',
          display: 'flex',
          justifyContent: 'center',
          overflowY: 'auto',
        },
        content: {
          top: 'auto',
          bottom: 'auto',
          left: 'auto',
          right: 'auto',
          borderRadius: 0,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          backgroundColor: 'transparent',
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
      <div
        className={`uk-background-default ${className}`}
        style={{ margin: 15, position: 'relative' }}
      >
        {children}
      </div>
    </Modal>
  );
};

CustomModal.propTypes = {
  children: PropTypes.element.isRequired,
  closeOnNextRender: PropTypes.bool,
  className: PropTypes.string,
};

CustomModal.defaultProps = {
  closeOnNextRender: false,
  className: '',
};

export { CustomModal as Modal };
