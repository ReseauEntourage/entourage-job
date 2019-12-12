/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import ModalGeneric from './ModalGeneric';
import HeaderModal from './HeaderModal';
import FormWithValidation from '../forms/FormWithValidation';

import { Button, CloseButtonNoSSR, IconNoSSR } from '../utils';

function renderButton(buttonType, id) {
  switch (buttonType) {
    case 'pencil':
      return (
        <Button style="text" toggle={`target: #${id}`}>
          <IconNoSSR name="pencil" ratio={1.5} />
        </Button>
      );
    case 'plus':
      return (
        <Button style="text" toggle={`target: #${id}`}>
          <IconNoSSR name="plus" ratio={1.5} />
        </Button>
      );
    default:
      return (
        <Button style="default" toggle={`target: #${id}`}>
          {buttonType}
        </Button>
      );
  }
}
const ModalEdit = ({
  id,
  button,
  title,
  description,
  formSchema,
  defaultValues,
  onSubmit,
}) => (
  <>
    {renderButton(button, id)}
    <ModalGeneric id={id}>
      {(closeModal) => (
        <>
          <CloseButtonNoSSR className="uk-modal-close-default" />
          <HeaderModal>{title}</HeaderModal>
          {description ? (
            <p
              className="uk-text-lead"
              style={{
                lineHeight: '1.2',
                fontSize: '1.2rem',
                fontWeight: '500',
              }}
            >
              {description}
            </p>
          ) : null}

          <FormWithValidation
            submitText="Sauvegarder"
            formSchema={formSchema}
            defaultValues={defaultValues}
            onCancel={closeModal}
            onSubmit={(fields) => {
              closeModal();
              onSubmit(fields);
            }}
          />
        </>
      )}
    </ModalGeneric>
  </>
);
ModalEdit.propTypes = {
  id: PropTypes.string.isRequired,
  button: PropTypes.string,
  title: PropTypes.element.isRequired,
  formSchema: PropTypes.shape({
    id: PropTypes.string,
    fields: PropTypes.object,
    rules: PropTypes.object,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.arrayOf(PropTypes.string),
  description: PropTypes.string,
};
ModalEdit.defaultProps = {
  button: 'pencil',
  defaultValues: [],
  description: undefined,
};

export default ModalEdit;
