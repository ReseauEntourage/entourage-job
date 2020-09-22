/* global UIkit */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { CloseButtonNoSSR } from '../utils/CloseButton';
import HeaderModal from './HeaderModal';
import { ModalContext } from '../store/ModalProvider';
/**
 * Ce composant fournit une modal à contenu variable selon l'index ou l'on s'y trouve
 * composers est un tableau de functions attendant 3 fonctions (action: close, next, previous) et retournant un composant
 * cela permet de gérer le flux/ la modale depuis ses composant internes
 */

const StepperModal = ({
  components,
  id,
  title
}) => {
  const {
    index,
    setClose
  } = useContext(ModalContext);

  return <div id={id} className="uk-flex-top" data-uk-modal="bg-close:false">
    <div className="uk-modal-dialog uk-margin-auto-vertical uk-width-2-3@m uk-width-1-2@l">
      <CloseButtonNoSSR onClick={() => setClose(true)} />
      <div className="uk-modal-body uk-padding-large">
        <HeaderModal>{title}</HeaderModal>
        {components && components[index]}
      </div>
    </div>
  </div>;
};

StepperModal.propTypes = {
  components: PropTypes.arrayOf(PropTypes.element).isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
};
export default StepperModal;