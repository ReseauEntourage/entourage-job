/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import ModalGeneric from './ModalGeneric';
import HeaderModal from './HeaderModal';
import FormWithValidation from '../forms/FormWithValidation';

import { Button, CloseButtonNoSSR } from '../utils';

// ajouter les valeurs par default des champs
// va parcourir les champs et leurs assignant leurs variable par default, ainsi que les groupe de champs de maniere recursive
// retourne tous les fields avec leurs valeurs par default
function fieldsWithDefaultValues(defaultValues, fields) {
  const myFields = fields;
  defaultValues.forEach((value, i) => {
    if (Array.isArray(value) && fields[i].component === 'fieldgroup') {
      myFields[i].fields = fieldsWithDefaultValues(value, fields[i].fields);
    }
    return (myFields[i].value = value);
  });
  return myFields;
}

const ModalEdit = ({
  id,
  title,
  description,
  formSchema,
  defaultValues,
  onSubmit,
}) => {
  const schema = {
    ...formSchema,
    fields: fieldsWithDefaultValues(defaultValues, formSchema.fields),
  };
  return (
    <>
      {/* todo retirer le bouton quand les testes seront terminés */}
      <Button style="default" toggle={`target: #${id}`}>
        {id}
      </Button>
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
              formData={schema}
              onCancel={closeModal}
              onSubmit={(fields) => {
                onSubmit(fields);
                closeModal();
              }}
            />
          </>
        )}
      </ModalGeneric>
    </>
  );
};
ModalEdit.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
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
  defaultValues: [],
  description: undefined,
};

export default ModalEdit;
