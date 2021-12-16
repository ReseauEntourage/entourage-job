import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { CloseButton } from 'src/components/utils';
import HeaderModal from 'src/components/modals/HeaderModal';
import { Modal, useModalContext } from 'src/components/modals/Modal';

/**
 * Ce composant fournit une modal à contenu variable selon l'index ou l'on s'y trouve
 * composers est un tableau de functions attendant 3 fonctions (action: close, next, previous) et retournant un composant
 * cela permet de gérer le flux/ la modale depuis ses composant internes
 */
const StepperModal = ({ composers, title }) => {
  const [index, setIndex] = useState(0);
  const [wrappedComponents, setWrappedComponents] = useState();

  const { onClose } = useModalContext();

  const close = useCallback(() => {
    onClose();
    setIndex(0);
  }, [onClose]);

  const next = useCallback(() => {
    setIndex((prevIndex) => {
      return prevIndex + 1;
    });
  }, []);

  const previous = useCallback(() => {
    setIndex((prevIndex) => {
      return prevIndex - 1;
    });
  }, []);

  useEffect(() => {
    if (composers) {
      setWrappedComponents(
        composers.map((composer) => {
          return composer(close, next, previous);
        })
      );
    }
  }, [close, composers, next, previous]);

  return (
    <Modal>
      <div className="uk-margin-auto-vertical">
        <div className="uk-modal-body uk-padding-large">
          <CloseButton
            className="uk-modal-close-default"
            onClick={() => {
              setIndex(0);
              onClose();
            }}
          />
          <HeaderModal>{title}</HeaderModal>
          {wrappedComponents && wrappedComponents[index]}
        </div>
      </div>
    </Modal>
  );
};

StepperModal.propTypes = {
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  composers: PropTypes.arrayOf(PropTypes.func).isRequired,
};

StepperModal.defaultProps = {};

export default StepperModal;
