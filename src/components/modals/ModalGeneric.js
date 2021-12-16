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
        <div className="uk-modal-body uk-padding-large">
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
  children: PropTypes.func.isRequired,
  classNameSize: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  onClose: PropTypes.func,
};

ModalGeneric.defaultProps = {
  classNameSize: 'uk-width-1-1 uk-width-2-3@l uk-width-1-2@xl',
  description: undefined,
  title: undefined,
  onClose: () => {},
};

export default ModalGeneric;
