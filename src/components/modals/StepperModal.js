/* global UIkit */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { CloseButton } from 'src/components/utils';
import HeaderModal from 'src/components/modals/HeaderModal';
import { Modal } from './Modal';

/**
 * Ce composant fournit une modal à contenu variable selon l'index ou l'on s'y trouve
 * composers est un tableau de functions attendant 3 fonctions (action: close, next, previous) et retournant un composant
 * cela permet de gérer le flux/ la modale depuis ses composant internes
 */
const StepperModal = ({ composers, title, id, resetForm }) => {
  const [index, setIndex] = useState(0);
  const [wrappedComponents, setWrappedComponents] = useState();

  const close = useCallback(() => {
    resetForm();
    UIkit.modal(`#${id}`).hide();
    // TODO: Probleme car il est possible que la modale se ferme par un moyen autre qu'ici (uk-close-icon~)
    setIndex(0);
  }, [id, resetForm]);

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
      <div id={id} className="uk-flex" data-uk-modal="bg-close:false">
        <div className="uk-modal-dialog uk-margin-auto-vertical uk-width-2-3@m uk-width-1-2@l">
          <CloseButton
            className="uk-modal-close-default"
            onClick={() => {
              resetForm();
              setIndex(0);
            }}
          />
          <div className="uk-modal-body uk-padding-large">
            <HeaderModal>{title}</HeaderModal>
            {wrappedComponents && wrappedComponents[index]}
          </div>
        </div>
      </div>
    </Modal>
  );
};

StepperModal.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  composers: PropTypes.arrayOf(PropTypes.func).isRequired,
  resetForm: PropTypes.func,
};

StepperModal.defaultProps = {
  resetForm: () => {},
};

export default StepperModal;
