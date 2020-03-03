/* global UIkit */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR, CloseButtonNoSSR, Button } from '../utils';
import ModalGeneric from '../modals/ModalGeneric';
import HeaderModal from '../modals/HeaderModal';
import '../../static/css/Toggle.less';

const ToggleWithConfirmationModal = ({
  id,
  title,
  modalTitle,
  modalDescription,
  modalConfirmation,
  defaultValue,
  onToggle,
}) => {
  const [toggle, setToggle] = useState();
  useEffect(() => {
    setToggle(defaultValue);
  }, [defaultValue]);
  return (
    <>
      <div className="uk-form-controls uk-margin-top">
        <div className="ent-toggle">
          <input
            id={`ent-toggle-${id}`}
            type="checkbox"
            checked={toggle}
            onChange={() => {
              if (toggle) {
                onToggle(false).then(() => setToggle(false));
              } else {
                UIkit.modal(`#modal-confirm-${id}`).show();
              }
            }}
          />
          <span className="ent-slider round" />
        </div>
        <label className="uk-margin-small-left" htmlFor={`ent-toggle-${id}`}>
          {title}
        </label>
      </div>
      <ModalGeneric id={`modal-confirm-${id}`}>
        {(closeModal) => (
          <>
            <CloseButtonNoSSR className="uk-modal-close-default" />
            <HeaderModal>{modalTitle}</HeaderModal>
            {modalDescription && (
              <p
                className="uk-text-lead"
                style={{
                  lineHeight: '1.2',
                  fontSize: '1.2rem',
                  fontWeight: '500',
                }}
              >
                {modalDescription}
              </p>
            )}
            <GridNoSSR className="uk-grid-small uk-flex-center uk-margin-large-top">
              <Button style="default" onClick={closeModal}>
                Annuler
              </Button>
              <Button
                style="primary"
                onClick={() => {
                  onToggle(true).then(() => setToggle(true));
                  closeModal();
                }}
              >
                {modalConfirmation}
              </Button>
            </GridNoSSR>
          </>
        )}
      </ModalGeneric>
    </>
  );
};
ToggleWithConfirmationModal.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  modalDescription: PropTypes.string,
  modalConfirmation: PropTypes.string,
  onToggle: PropTypes.func.isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};
ToggleWithConfirmationModal.defaultProps = {
  defaultValue: undefined,
  modalDescription: undefined,
  modalConfirmation: 'Oui',
};

export default ToggleWithConfirmationModal;
