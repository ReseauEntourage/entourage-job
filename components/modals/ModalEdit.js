/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import ModalGeneric from './ModalGeneric';
import HeaderModal from './HeaderModal';
import FormWithValidation from '../forms/FormWithValidation';

import { Button, CloseButtonNoSSR, IconNoSSR } from '../utils';

// ajouter les valeurs par default des champs
// va parcourir les champs et leurs assignant leurs variable par default, ainsi que les groupe de champs de maniere recursive
// retourne tous les fields avec leurs valeurs par default
function fieldsWithDefaultValues(defaultValues, fields) {
  const myFields = [...fields];
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
  button,
  title,
  description,
  formSchema,
  defaultValues,
  onSubmit,
}) => {
  /**
   * Fix value in formSchema
   */
  const fixFormSchema = formSchema;
  fixFormSchema.fields.map((field) => {
    const changeField = field;
    return (changeField.value = '');
  });
  const schema = {
    ...formSchema,
    fields: [...fieldsWithDefaultValues(defaultValues, formSchema.fields)],
  };

  return (
    <>
      {button === 'pencil' ? (
        <Button style="text" toggle={`target: #${id}`}>
          <IconNoSSR name="pencil" ratio={1.5} />
        </Button>
      ) : (
        <Button style="default" toggle={`target: #${id}`}>
          {button}
        </Button>
      )}

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
              onSubmit={(fields, setError) => {
                closeModal();
                onSubmit(fields, setError);
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
