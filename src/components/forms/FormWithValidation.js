/* eslint-disable camelcase */
/* eslint-disable default-case */
/* eslint-disable max-classes-per-file */

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import FooterForm from 'src/components/utils/FooterForm';
import FormValidator from 'src/components/forms/FormValidator';
import GenericField from 'src/components/forms/GenericField';
import FieldGroup from 'src/components/forms/fields/FieldGroup';

/**
 * Permet de creer un formulaire avec la generation de ses champs et validations de champs
 * Regroupe les deux composants du fichier formWithValidationOld en stateless
 * - Plus lisible
 */
const FormWithValidation = forwardRef(
  (
    {
      formSchema: { id, rules, fields },
      defaultValues,
      submitText,
      onSubmit,
      onCancel,
      enterToSubmit,
    },
    ref
  ) => {
    const validator = new FormValidator(rules);

    const [error, setError] = useState();

    const [fieldValidations, setFieldValidations] = useState({});
    const [fieldValues, setFieldValues] = useState({});

    // fonction permettant de verifier une champs d'entré utilisateur
    const updateForm = (args) => {
      let onChangeArgs = args;
      if (!Array.isArray(onChangeArgs)) {
        onChangeArgs = [onChangeArgs];
      }
      const tmpFieldValues = { ...fieldValues };
      const tmpFieldValidations = fieldValidations;
      for (let i = 0; i < onChangeArgs.length; i += 1) {
        const {
          target: { name, type, value, checked, selectedIndex },
        } = onChangeArgs[i];

        let fieldValue;
        if (type === 'checkbox') {
          fieldValue = checked;
        } else if (type === 'select-one' && selectedIndex === 0) {
          fieldValue = null; // si on est sur le placeholder ( option sans valeur )
        } else fieldValue = value;

        /* Validators start */
        tmpFieldValues[name] = fieldValue;

        const validation = validator.validate(tmpFieldValues); // envoie une copie des champs pour que le state ne soit pas altéré

        // enregistre la raison de la validation {isInvalid: boolean, message: string}
        if (validation[name] !== undefined) {
          tmpFieldValidations[`valid_${name}`] = validation[name];
        }
      }

      setFieldValues(tmpFieldValues); // enregistre la valeur du champs
      setFieldValidations(tmpFieldValidations);

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
        onSubmit(fieldValues, (msg) => {
          return setError(msg);
        }); // c'est le props onsubmit de FormWithValidation
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

    const initializeForm = useCallback(() => {
      // on extrait les nom des champs
      const fieldsId = fields.reduce((acc, curr) => {
        if (curr.component === 'fieldgroup') {
          return [
            ...acc,
            ...curr.fields.map((field) => {
              return field.id;
            }),
          ];
        }
        return [...acc, curr.id];
      }, []);

      const validations = fieldsId.reduce((acc, value) => {
        acc[`valid_${value}`] = undefined;
        return acc;
      }, {});
      const values = fieldsId.reduce((acc, value) => {
        acc[value] = defaultValues[value];
        return acc;
      }, {});

      setFieldValues(values);
      setFieldValidations(validations);
    }, [defaultValues, fields]);

    useImperativeHandle(ref, () => {
      return {
        resetForm: initializeForm,
      };
    });

    useEffect(() => {
      initializeForm();
    }, [initializeForm]);

    return (
      <>
        <form
          id={id}
          className="uk-form-stacked uk-grid-small uk-width-1-1 uk-child-width-1-1"
          data-uk-grid
          onSubmit={submitForm}
          onKeyDown={(ev) => {
            if (enterToSubmit) {
              if (ev.key === 'Enter') {
                submitForm(ev);
              }
            }
          }}
        >
          <fieldset className="uk-fieldset">
            {fields.map((value, i) => {
              if (value.component === 'fieldgroup') {
                const { fields: childrenFields, title, id: childrenId } = value;
                return (
                  <li key={i} hidden={!!value.hidden}>
                    <FieldGroup
                      id={childrenId}
                      title={title}
                      fields={childrenFields.map((field) => {
                        return (
                          <GenericField
                            data={field}
                            formId={id}
                            value={fieldValues[field.id]}
                            onChange={updateForm}
                            getValid={(name) => {
                              return fieldValidations[`valid_${name}`];
                            }}
                            getValue={(name) => {
                              return fieldValues[name];
                            }}
                          />
                        );
                      })}
                    />
                  </li>
                );
              }
              return (
                <li key={i} hidden={!!value.hidden}>
                  <GenericField
                    data={value}
                    formId={id}
                    value={fieldValues[value.id]}
                    onChange={updateForm}
                    getValid={(name) => {
                      return fieldValidations[`valid_${name}`];
                    }}
                    getValue={(name) => {
                      return fieldValues[name];
                    }}
                  />
                </li>
              );
            })}
          </fieldset>
        </form>
        <FooterForm
          error={error}
          submitText={submitText}
          onSubmit={submitForm}
          onCancel={
            onCancel &&
            (() => {
              initializeForm();
              onCancel();
            })
          }
        />
      </>
    );
  }
);

FormWithValidation.propTypes = {
  defaultValues: PropTypes.objectOf(PropTypes.any),
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  formSchema: PropTypes.shape({
    id: PropTypes.string,
    fields: PropTypes.arrayOf(PropTypes.object),
    rules: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  submitText: PropTypes.string,
  enterToSubmit: PropTypes.bool,
};

FormWithValidation.defaultProps = {
  submitText: undefined,
  defaultValues: {},
  onCancel: undefined,
  enterToSubmit: false,
};

export default FormWithValidation;
