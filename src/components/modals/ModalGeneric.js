import React from 'react';
import PropTypes from 'prop-types';
import { Modal, useModalContext } from 'src/components/modals/Modal';
import { CloseButton } from 'src/components/utils';
import HeaderModal from './HeaderModal';

const ModalGeneric = ({
  title,
  description,
  children,
  onClose: customOnClose,
  className,
}) => {
  const { onClose } = useModalContext();
  return (
    <Modal className={className}>
      <div className="uk-margin-auto-vertical uk-width-2xlarge@m">
        <div className="uk-modal-body uk-padding">
          <CloseButton
            className="uk-modal-close-default"
            onClick={() => {
              if (customOnClose) {
                customOnClose(onClose);
              } else {
                onClose();
              }
            }}
          />
          {title && <HeaderModal>{title}</HeaderModal>}
          {description ? <p className="uk-text-lead">{description}</p> : null}
          {children}
        </div>
      </div>
    </Modal>
  );
};

ModalGeneric.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  onClose: PropTypes.func,
  className: PropTypes.string,
};

ModalGeneric.defaultProps = {
  description: undefined,
  title: undefined,
  onClose: undefined,
  className: '',
};

export default ModalGeneric;
