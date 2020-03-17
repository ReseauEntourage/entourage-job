/* global UIkit */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { CloseButtonNoSSR } from '../utils/CloseButton';
import HeaderModal from './HeaderModal';

/**
 * Ce composant fournit une modal à contenu variable selon l'index ou l'on s'y trouve
 * composers est un tableau de functions attendant 3 fonctions (action: close, next, previous) et retournant un composant
 * cela permet de gérer le flux/ la modale depuis ses composant internes
 */
const StepperModal = ({ composers, title, id }) => {
  const [index, setIndex] = useState(0);
  const [wrappedComponents, setWrappedComponents] = useState();
  const close = () => {
    UIkit.modal(`#${id}`).hide();
    // TODO: Probleme car il est possible que la modale se ferme par un moyen autre qu'ici (uk-close-icon~)
    setIndex(0);
  };
  const next = () => {
    setIndex(index + 1);
  };
  const previous = () => {
    setIndex(index - 1);
  };
  useEffect(() => {
    if (composers) {
      setWrappedComponents(
        composers.map((composer) => composer(close, next, previous))
      );
    }
  }, [composers]);
  return (
    <div id={id} className="uk-flex-top" data-uk-modal="bg-close:false">
      <div className="uk-modal-dialog uk-margin-auto-vertical uk-width-2-3@m uk-width-1-2@l">
        <CloseButtonNoSSR className="uk-modal-close-default" />
        <div className="uk-modal-body uk-padding-large">
          <HeaderModal>{title}</HeaderModal>
          {wrappedComponents && wrappedComponents[index]}
        </div>
      </div>
    </div>
  );
};
StepperModal.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.element.isRequired,
  composers: PropTypes.arrayOf(PropTypes.func).isRequired,
};
export default StepperModal;
