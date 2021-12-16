import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from 'src/components/utils';
import ModalGeneric from 'src/components/modals/ModalGeneric';
import ModalEdit from 'src/components/modals/ModalEdit';
import { openModal, useModalContext } from 'src/components/modals/Modal';

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
  const { onClose } = useModalContext();
  const [toggle, setToggle] = useState(defaultValue);
  useEffect(() => {
    setToggle(defaultValue);
  }, [defaultValue]);

  return (
    <>
      <div className="uk-form-controls uk-margin-top">
        <div className="uk-flex uk-flex-middle">
          <div className="ent-toggle">
            <label htmlFor={`ent-toggle-${id}`}>
              <input
                id={`ent-toggle-${id}`}
                type="checkbox"
                checked={toggle}
                onChange={() => {
                  if (toggle) {
                    onToggle(false).then(() => {
                      return setToggle(false);
                    });
                  } else if (formSchema) {
                    openModal(
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
                    );
                  } else {
                    openModal(
                      <ModalGeneric
                        title={modalTitle}
                        description={modalDescription}
                      >
                        <Grid className="uk-grid-small uk-flex-center uk-margin-large-top">
                          <Button style="default" onClick={onClose}>
                            Annuler
                          </Button>
                          <Button
                            style="primary"
                            onClick={() => {
                              onToggle(true).then(() => {
                                return setToggle(true);
                              });
                              onClose();
                            }}
                          >
                            {modalConfirmation}
                          </Button>
                        </Grid>
                      </ModalGeneric>
                    );
                  }
                }}
              />
              <span className="ent-slider round" />
            </label>
          </div>
          <div className="uk-flex uk-flex-column uk-margin-small-left">
            <span className="">{title}</span>
            {subtitle}
          </div>
        </div>
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
