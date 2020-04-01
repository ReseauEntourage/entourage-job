/* eslint-disable camelcase */
/* eslint-disable default-case */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FooterForm from '../utils/FooterForm';
import withValidation from './withValidation';
import FieldFactory from './fields/FieldFactory';

// TODO REFACTOR parceque cest illisible !
export class Form extends Component {
  static get propTypes() {
    return {
      // Gere la mise à jour des entrés utilisateur
      // prend en parametre un event (input, textarea...) renvoie void
      handleChange: PropTypes.func.isRequired,
      // Gere l'envoie du formulaire
      // renvoie une promesse informant si les champs sont corrects
      handleSubmit: PropTypes.func.isRequired,
      // action effectué lors de l'annulation d'un formulaire
      afterCancel: PropTypes.func,
      // action effectué apres l'envoie du formulaire
      afterSubmit: PropTypes.func,

      id: PropTypes.string.isRequired,
      submitText: PropTypes.string,
      fieldsInfo: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
        })
      ).isRequired,

      defaultValues: PropTypes.objectOf(PropTypes.string),
    };
  }

  static get defaultProps() {
    return {
      afterCancel: undefined,
      afterSubmit: undefined,
      submitText: undefined,
      defaultValues: undefined,
    };
  }

  static initializeForm(fieldsInfo, defaultValues) {
    // todo revoir la structure du state
    // on extrait les nom des champs
    const fieldsId = fieldsInfo.map((field) => field.id);

    const values = fieldsId.reduce((acc, id) => {
      acc[id] = defaultValues[id];
      return acc;
    }, {});

    const validation = fieldsId.reduce((acc, id) => {
      acc[`valid_${id}`] = undefined;
      return acc;
    }, {});

    return {
      setValid: (key, value) => (validation[`valid_${key}`] = value),
      getValid: (key) => validation[`valid_${key}`],
      setValue: (key, value) => (values[key] = value),
      getValue: (key) => values[key],
      getValues: () => values,
    };
  }

  constructor(props) {
    super(props);
    this.state = this.createState(props);

    const { id, defaultValues } = this.props;
    const { handleChange, fields, getValid, getValue } = this.state;
    this.fieldFactory = new FieldFactory(
      id,
      fields,
      defaultValues,
      handleChange,
      getValid,
      getValue
    );
  }

  onSubmit(event) {
    event.preventDefault();
    const { handleSubmit } = this.state;
    handleSubmit() // Vérifie les champs avant soumission
      .then((fields) => {
        // Si les validators sont OK.
        const { afterSubmit, fieldsInfo, defaultValues } = this.props;
        // S273 : suppression de la réinitialisation provoquant le bug
        /* this.setState(
          this.constructor.initializeForm(fieldsInfo, defaultValues)
        ); */
        afterSubmit(fields, (error) => this.setState({ error })); // c'est le props onsubmit de FormWithValidation
      })
      .catch(console.error);
  }

  createState({ handleChange, handleSubmit, fieldsInfo, defaultValues }) {
    // todo revoir la structure du state
    return {
      error: null,
      handleChange: handleChange.bind(this),
      handleSubmit: handleSubmit.bind(this),
      onSubmit: this.onSubmit.bind(this),
      ...this.constructor.initializeForm(fieldsInfo, defaultValues),
    };
  }

  render() {
    const { error, onSubmit } = this.state;
    const {
      submitText,
      afterCancel,
      fieldsInfo,
      id,
      defaultValues,
    } = this.props;
    return (
      <div className="uk-width-1-1">
        <form
          id={id}
          className="uk-form-stacked uk-grid-small uk-child-width-1-1"
          data-uk-grid
          onSubmit={onSubmit}
        >
          <fieldset className="uk-fieldset uk-width-1-1">
            {fieldsInfo.map((value, i) => (
              <li key={i}>{this.fieldFactory.generate(value)}</li>
            ))}
          </fieldset>
          <div>
            <FooterForm
              error={error}
              submitText={submitText}
              onSubmit={onSubmit}
              onCancel={() => {
                this.setState(
                  this.constructor.initializeForm(fieldsInfo, defaultValues)
                );
                afterCancel();
              }}
            />
          </div>
        </form>
      </div>
    );
  }
}

const FormWithValidation = ({
  formSchema,
  defaultValues,
  onCancel,
  onSubmit,
  submitText,
}) => {
  const GeneratedForm = withValidation(Form, formSchema.rules);
  return (
    <GeneratedForm
      id={formSchema.id}
      fieldsInfo={formSchema.fields}
      defaultValues={defaultValues}
      afterCancel={onCancel}
      afterSubmit={onSubmit}
      submitText={submitText}
    />
  );
};
FormWithValidation.propTypes = {
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
FormWithValidation.defaultProps = {
  submitText: undefined,
  defaultValues: [],
};
export default FormWithValidation;
