/* eslint-disable camelcase */
/* eslint-disable default-case */
/* eslint-disable max-classes-per-file */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FooterForm from '../utils/FooterForm';
import FormValidator from './FormValidator';
import FieldFactory from './fields/FieldFactory';

const FormWithValidationV2 = ({
  formSchema: { id, rules, fields },
  defaultValues, // backup
  submitText,
  onSubmit,
  onCancel,
}) => {
  const [validator, setValidator] = useState();

  const [usedDefaultValues, setUsedDefaultValues] = useState(defaultValues);
  const [error, setError] = useState();
  const [fieldFactory, setFieldFactory] = useState();

  const [fieldValidations, setFieldValidations] = useState({});
  const [fieldValues, setFieldValues] = useState({});

  const setValid = (key, value) =>
    setFieldValidations({ ...fieldValidations, [`valid_${key}`]: value });
  const setValue = (key, value) =>
    setFieldValues({ ...fieldValues, [key]: value });

  const getValid = (key) => fieldValidations[`valid_${key}`];
  const getValue = (key) => fieldValues[key];

  // fonction permettant de verifier une champs d'entré utilisateur
  const updateForm = ({
    target: { checked, name, type, value, selectedIndex },
  }) => {
    if (validator) {
      let fieldValue;
      if (type === 'checkbox') {
        fieldValue = checked;
      } else if (type === 'select-one' && selectedIndex === 0) {
        fieldValue = null; // si on est sur le placeholder ( option sans valeur )
      } else fieldValue = value;

      /* Validators start */
      setValue(name, fieldValue); // enregistre la valeur du champs
      const validation = validator.validate(fieldValues); // envoie une copie des champs pour que le state ne soit pas altéré

      // enregistre la raison de la validation {isInvalid: boolean, message: string}
      if (validation[name] !== undefined) {
        setValid(name, validation[name]);
      }

      /* Validators end */
      setError('');
    }
  };

  const submitForm = (event) => {
    if (validator) {
      event.preventDefault();
      // Vérifie les champs avant soumission
      /* Validators control before submit */
      const validation = validator.validate(fieldValues);
      if (validation.isValid) {
        // Si les validators sont OK.
        onSubmit(fieldValues, (msg) => setError(msg)); // c'est le props onsubmit de FormWithValidation
      } else {
        // erreur de validation
        Object.keys(validation).forEach((key) => {
          if (key !== 'isValid') {
            setValid(key, validation[key]);
          }
        });
        setError('Un ou plusieurs champs sont invalides');
        console.error({ validation });
      }
    }
  };

  useEffect(() => {
    setValidator(new FormValidator(rules));

    // todo revoir la structure du state
    // on extrait les nom des champs
    const fieldsId = fields.map((field) => field.id);

    setFieldValues(
      fieldsId.reduce((acc, value) => {
        acc[value] = usedDefaultValues[value];
        return acc;
      }, {})
    );

    setFieldValidations(
      fieldsId.reduce((acc, value) => {
        acc[`valid_${value}`] = undefined;
        return acc;
      }, {})
    );

    setFieldFactory(
      new FieldFactory(
        id,
        fields,
        usedDefaultValues,
        updateForm,
        getValid,
        getValue
      )
    );
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
          {fieldFactory &&
            fields.map((value, i) => (
              <li key={i}>{fieldFactory.generate(value)}</li>
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
                setUsedDefaultValues(defaultValues);
                //
                fieldFactory.reset();
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
