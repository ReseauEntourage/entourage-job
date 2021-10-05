/* global UIkit */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, CloseButton, Grid } from 'src/components/utils';
import ModalGeneric from 'src/components/modals/ModalGeneric';
import HeaderModal from 'src/components/modals/HeaderModal';
import 'static/css/Toggle.less';
import ModalEdit from 'src/components/modals/ModalEdit';

const ToggleWithConfirmationModal = ({
  id,
  title,
  subtitle,
  modalTitle,
  modalDescription,
  modalConfirmation,
  defaultValue,
  onToggle,
  formSchema,
}) => {
  const [toggle, setToggle] = useState(defaultValue);
  useEffect(() => {
    setToggle(defaultValue);
  }, [defaultValue]);

  return (
    <>
      <div className="uk-form-controls uk-margin-top">
        <div className="uk-flex uk-flex-middle">
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
          <div className="uk-flex uk-flex-column uk-margin-small-left">
            <span className="">{title}</span>
            {subtitle}
          </div>
        </div>
      </div>
      <div>
        {formSchema ? (
          <ModalEdit
            title={modalTitle}
            description={modalDescription}
            formSchema={formSchema}
            submitText={modalConfirmation}
            onSubmit={(fields, closeModal) => {
              onToggle(true, fields).then(() => {
                return setToggle(true);
              });
              closeModal();
            }}
            id={`modal-confirm-${id}`}
          />
        ) : (
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
        )}
      </div>
    </>
  );
};
ToggleWithConfirmationModal.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  modalTitle: PropTypes.string.isRequired,
  modalDescription: PropTypes.element,
  modalConfirmation: PropTypes.string,
  onToggle: PropTypes.func.isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  formSchema: PropTypes.shape({
    id: PropTypes.string,
    fields: PropTypes.arrayOf(PropTypes.object),
    rules: PropTypes.arrayOf(PropTypes.object),
  }),
};
ToggleWithConfirmationModal.defaultProps = {
  defaultValue: undefined,
  subtitle: undefined,
  modalDescription: undefined,
  modalConfirmation: 'Oui',
  formSchema: undefined,
};

export default ToggleWithConfirmationModal;
