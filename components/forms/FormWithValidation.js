/* eslint-disable camelcase */
/* eslint-disable default-case */
/* eslint-disable max-classes-per-file */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FooterForm from '../utils/FooterForm';
import FormValidator from './FormValidator';
import generate from './fieldGenerator';

/**
 * Permet de creer un formulaire avec la generation de ses champs et validations de champs
 * Regroupe les deux composants du fichier formWithValidationOld en stateless
 * - Plus lisible
 */
const FormWithValidation = ({
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
    <form
      id={id}
      className="uk-form-stacked uk-grid-small uk-width-1-1 uk-child-width-1-1"
      data-uk-grid
      onSubmit={submitForm}
    >
      <fieldset className="uk-fieldset">
        {fields.map((value, i) => (
          <li key={i} hidden={!!value.hidden}>
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
      <FooterForm
        error={error}
        submitText={submitText}
        onSubmit={submitForm}
        onCancel={
          onCancel &&
          (() => {
            // todo: le reset des champs ne fonctionne pas avec un simple changement de state
            // Peut etre tenter en travaillant sur le generate field et ses champs
            const tmpDefaultValues = defaultValues;
            fields.forEach((field) => {
              tmpDefaultValues[field.id] = '';
            });
            setUsedDefaultValues(tmpDefaultValues);
            onCancel();
          })
        }
      />
    </form>
  );
};
FormWithValidation.propTypes = {
  defaultValues: PropTypes.arrayOf(PropTypes.string),
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  formSchema: PropTypes.shape({
    id: PropTypes.string,
    fields: PropTypes.arrayOf(PropTypes.object),
    rules: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  submitText: PropTypes.string,
};
FormWithValidation.defaultProps = {
  submitText: undefined,
  defaultValues: [],
  onCancel: undefined
};
export default FormWithValidation;
