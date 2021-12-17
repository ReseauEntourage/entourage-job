import React from 'react';
import PropTypes from 'prop-types';
import { Modal, useModalContext } from 'src/components/modals/Modal';
import { CloseButton } from 'src/components/utils';
import HeaderModal from './HeaderModal';

const ModalGeneric = ({
  title,
  description,
  children,
  classNameSize: className,
  onClose: customOnClose,
}) => {
  const { onClose } = useModalContext();
  return (
    <Modal>
      <div className={`uk-margin-auto-vertical ${className}`}>
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
          <HeaderModal>{title}</HeaderModal>
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
  classNameSize: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  onClose: PropTypes.func,
};

ModalGeneric.defaultProps = {
  classNameSize: '',
  description: undefined,
  title: undefined,
  onClose: undefined,
};

export default ModalGeneric;
