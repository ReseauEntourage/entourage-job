/* global UIkit */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, CloseButton, Button } from 'src/components/utils';
import ModalGeneric from 'src/components/modals/ModalGeneric';
import HeaderModal from 'src/components/modals/HeaderModal';
import 'static/css/Toggle.less';

const ToggleWithConfirmationModal = ({
  id,
  title,
  modalTitle,
  modalDescription,
  modalConfirmation,
  defaultValue,
  onToggle,
}) => {
  const [toggle, setToggle] = useState(defaultValue);
  useEffect(() => {
    setToggle(defaultValue);
  }, [defaultValue]);
  return (
    <>
      <div className="uk-form-controls uk-margin-top">
        <label htmlFor={`ent-toggle-${id}`}>
          <div className="ent-toggle">
            <input
              id={`ent-toggle-${id}`}
              type="checkbox"
              checked={toggle}
              onChange={() => {
                if (toggle) {
                  onToggle(false).then(() => {
                    return setToggle(false);
                  });
                } else {
                  UIkit.modal(`#modal-confirm-${id}`).show();
                }
              }}
            />
            <span className="ent-slider round" />
          </div>
          <span className="uk-margin-small-left">{title}</span>
        </label>
      </div>
      <div>
        <ModalGeneric id={`modal-confirm-${id}`}>
          {(closeModal) => {
            return (
              <>
                <CloseButton className="uk-modal-close-default" />
                <HeaderModal>{modalTitle}</HeaderModal>
                {modalDescription && (
                  <p className="uk-text-lead">{modalDescription}</p>
                )}
                <Grid className="uk-grid-small uk-flex-center uk-margin-large-top">
                  <Button style="default" onClick={closeModal}>
                    Annuler
                  </Button>
                  <Button
                    style="primary"
                    onClick={() => {
                      onToggle(true).then(() => {
                        return setToggle(true);
                      });
                      closeModal();
                    }}
                  >
                    {modalConfirmation}
                  </Button>
                </Grid>
              </>
            );
          }}
        </ModalGeneric>
      </div>
    </>
  );
};
ToggleWithConfirmationModal.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  modalDescription: PropTypes.element,
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
