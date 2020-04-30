/* eslint-disable camelcase */
/* eslint-disable default-case */
/* eslint-disable max-classes-per-file */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FooterForm from '../utils/FooterForm';
import FormValidator from './FormValidator';
import generate from './fieldGenerator';

const FormWithValidationV2 = ({
  formSchema: { id, rules, fields },
  defaultValues,
  submitText,
  onSubmit,
  onCancel,
}) => {
  const validator = new FormValidator(rules);

  const [usedDefaultValues, setUsedDefaultValues] = useState(defaultValues);
  const [error, setError] = useState();

  const [fieldValidations, setFieldValidations] = useState({});
  const [fieldValues, setFieldValues] = useState({});

  // fonction permettant de verifier une champs d'entré utilisateur
  const updateForm = ({
    target: { checked, name, type, value, selectedIndex },
  }) => {
    let fieldValue;
    if (type === 'checkbox') {
      fieldValue = checked;
    } else if (type === 'select-one' && selectedIndex === 0) {
      fieldValue = null; // si on est sur le placeholder ( option sans valeur )
    } else fieldValue = value;

    /* Validators start */
    const tmpFieldValues = fieldValues;
    tmpFieldValues[name] = fieldValue;
    setFieldValues(tmpFieldValues); // enregistre la valeur du champs
    const validation = validator.validate(tmpFieldValues); // envoie une copie des champs pour que le state ne soit pas altéré

    // enregistre la raison de la validation {isInvalid: boolean, message: string}
    if (validation[name] !== undefined) {
      const tmpFieldValidations = fieldValidations;
      tmpFieldValidations[`valid_${name}`] = validation[name];
      setFieldValidations(tmpFieldValidations);
    }

    /* Validators end */
    setError('');
  };

  const submitForm = (event) => {
    event.preventDefault();
    // Vérifie les champs avant soumission
    /* Validators control before submit */
    const validation = validator.validate(fieldValues);
    if (validation.isValid) {
      // Si les validators sont OK.
      onSubmit(fieldValues, (msg) => setError(msg)); // c'est le props onsubmit de FormWithValidation
    } else {
      // erreur de validation
      const tmpFieldValidations = fieldValidations;
      Object.keys(validation).forEach((key) => {
        if (key !== 'isValid') {
          tmpFieldValidations[`valid_${key}`] = validation[key];
        }
      });
      setFieldValidations(tmpFieldValidations);
      setError('Un ou plusieurs champs sont invalides');
      console.error(validation);
    }
  };

  useEffect(() => {
    // on extrait les nom des champs
    const fieldsId = fields.map((field) => field.id);

    const validations = fieldsId.reduce((acc, value) => {
      acc[`valid_${value}`] = undefined;
      return acc;
    }, {});
    const values = fieldsId.reduce((acc, value) => {
      acc[value] = usedDefaultValues[value];
      return acc;
    }, {});

    setFieldValues(values);
    setFieldValidations(validations);
  }, [fields, usedDefaultValues]);

  return (
    <div className="uk-width-1-1">
      <form
        id={id}
        className="uk-form-stacked uk-grid-small uk-child-width-1-1"
        data-uk-grid
        onSubmit={submitForm}
      >
        <fieldset className="uk-fieldset uk-width-1-1">
          {fields.map((value, i) => (
            <li key={i}>
              {generate(
                value,
                id,
                usedDefaultValues,
                updateForm,
                (name) => fieldValidations[`valid_${name}`],
                (name) => fieldValues[name]
              )}
            </li>
          ))}
        </fieldset>
        <div>
          <FooterForm
            error={error}
            submitText={submitText}
            onSubmit={submitForm}
            onCancel={
              onCancel &&
              (() => {
                // does not work
                // setUsedDefaultValues(defaultValues); // reset all values
                onCancel();
              })
            }
          />
        </div>
      </form>
    </div>
  );
};
FormWithValidationV2.propTypes = {
  defaultValues: PropTypes.arrayOf(PropTypes.string),
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formSchema: PropTypes.shape({
    id: PropTypes.string,
    fields: PropTypes.object,
    rules: PropTypes.object,
  }).isRequired,
  submitText: PropTypes.string,
};
FormWithValidationV2.defaultProps = {
  submitText: undefined,
  defaultValues: [],
};
export default FormWithValidationV2;
