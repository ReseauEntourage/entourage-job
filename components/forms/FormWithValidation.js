/* eslint-disable camelcase */
/* eslint-disable default-case */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FooterForm from '../utils/FooterForm';
import withValidation from './withValidation';
import FieldFactory from './fields/FieldFactory';

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

      fieldsInfo: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
        })
      ).isRequired,
    };
  }

  static get defaultProps() {
    return {
      afterCancel: undefined,
      afterSubmit: undefined,
    };
  }

  static initializeForm(fieldsInfo) {
    // todo revoir la structure du state
    // on extrait les nom des champs
    const fieldsName = fieldsInfo.map((field) => field.name);
    return {
      error: '',
      fields: {
        values: fieldsName.reduce((acc, item) => {
          acc[item] = '';
          return acc;
        }, {}),
        ...fieldsName.reduce((acc, item) => {
          acc[`valid_${item}`] = undefined;
          return acc;
        }, {}),
      },
    };
  }

  constructor(props) {
    super(props);
    this.state = this.createState(props);

    const { id } = this.props;
    const { handleChange, fields } = this.state;
    this.fieldFactory = new FieldFactory(id, fields, handleChange);
  }

  onSubmit(event) {
    event.preventDefault();
    const { handleSubmit } = this.state;

    handleSubmit()
      .then(({ fields }) => {
        const { afterSubmit, fieldsInfo } = this.props;
        this.setState(this.constructor.initializeForm(fieldsInfo));
        afterSubmit(fields, (error) => this.setState({ error }));
      })
      .catch(console.error);
  }

  createState({ handleChange, handleSubmit, fieldsInfo }) {
    // todo revoir la structure du state
    return {
      handleChange: handleChange.bind(this),
      handleSubmit: handleSubmit.bind(this),
      onSubmit: this.onSubmit.bind(this),
      ...this.constructor.initializeForm(fieldsInfo),
    };
  }

  render() {
    const { error, onSubmit } = this.state;
    const { afterCancel, fieldsInfo, id } = this.props;
    return (
      <div className="uk-width-1-1">
        <form
          id={id}
          className="uk-form-stacked uk-grid-small uk-child-width-1-1"
          data-uk-grid
        >
          <fieldset className="uk-fieldset uk-width-1-1">
            {fieldsInfo.map(this.fieldFactory.generate)}
          </fieldset>
          <div>
            <FooterForm
              error={error}
              onSubmit={onSubmit}
              onCancel={afterCancel}
            />
          </div>
        </form>
      </div>
    );
  }
}

const FormWithValidation = ({ formData, onCancel, onSubmit }) => {
  const GeneratedForm = withValidation(Form, formData.rules);
  return (
    <GeneratedForm
      id={formData.id}
      fieldsInfo={formData.fields}
      afterCancel={onCancel}
      afterSubmit={onSubmit}
    />
  );
};
FormWithValidation.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    id: PropTypes.string,
    fields: PropTypes.object,
    rules: PropTypes.object,
  }).isRequired,
};
export default FormWithValidation;
