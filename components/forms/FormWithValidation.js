/* eslint-disable camelcase */
/* eslint-disable default-case */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import DatePicker from './fields/DatePicker';
import Input from './fields/Input';
import Textarea from './fields/Textarea';
import CheckboxCGU from './fields/CheckboxCGU';
import FooterForm from '../utils/FooterForm';
import withValidation from './withValidation';

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
    const fieldsName = fieldsInfo.map((field) => field.name);
    return {
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
      error: '',
    };
  }

  constructor(props) {
    super(props);
    const { handleChange, handleSubmit, fieldsInfo } = this.props;

    // todo revoir la structure du state
    // const fieldsName = fieldsInfo.map((field) => field.name);
    this.state = {
      handleChange: handleChange.bind(this),
      handleSubmit: handleSubmit.bind(this),
      onSubmit: this.onSubmit.bind(this),
      ...this.constructor.initializeForm(fieldsInfo),
    };
  }

  onSubmit(event) {
    event.preventDefault();
    const { handleSubmit } = this.state;
    const { afterSubmit, fieldsInfo } = this.props;

    handleSubmit()
      .then(({ fields }) => {
        this.setState(this.constructor.initializeForm(fieldsInfo));
        afterSubmit(fields, (error) => this.setState({ error }));
      })
      .catch(console.error);
  }

  // todo create another component to manage fields
  generateFields() {
    const { fields, handleChange } = this.state;
    const { fieldsInfo, id } = this.props;
    return fieldsInfo.map((fieldInfo) => {
      if (fieldInfo.component === 'input') {
        return (
          <Input
            id={`${id}-${fieldInfo.name}`}
            placeholder={fieldInfo.placeholder}
            name={fieldInfo.name}
            title={fieldInfo.title}
            value={fieldInfo.value}
            type={fieldInfo.type}
            valid={fields[`valid_${fieldInfo.name}`]}
            onChange={handleChange}
          />
        );
      }
      if (fieldInfo.component === 'datepicker') {
        return (
          <DatePicker
            id={`${id}-${fieldInfo.name}`}
            placeholder={fieldInfo.placeholder}
            name={fieldInfo.name}
            title={fieldInfo.title}
            value={fieldInfo.value}
            valid={fields[`valid_${fieldInfo.name}`]}
            onChange={handleChange}
            pattern={fieldInfo.pattern}
            min={fieldInfo.min}
            max={fieldInfo.max}
          />
        );
      }
      if (fieldInfo.component === 'textarea') {
        return (
          <Textarea
            id={`${id}-${fieldInfo.name}`}
            name={fieldInfo.name}
            row={fieldInfo.row}
            title={fieldInfo.title}
            type={fieldInfo.type}
            value={fieldInfo.value}
            placeholder={fieldInfo.placeholder}
            valid={fields[`valid_${fieldInfo.name}`]}
            onChange={handleChange}
          />
        );
      }
      if (fieldInfo.component === 'cgu') {
        return (
          <CheckboxCGU
            id={`${id}-${fieldInfo.name}`}
            name={fieldInfo.name}
            title={
              <span>
                J&apos;accepte les{' '}
                <Link href="#">
                  <a>CGU</a>
                </Link>
              </span>
            }
            valid={fields[`valid_${fieldInfo.name}`]}
            onChange={handleChange}
          />
        );
      }
      throw `component ${fieldInfo.component} does not exist`; // eslint-disable-line no-throw-literal
    });
  }

  render() {
    const { error, onSubmit } = this.state;
    const { afterCancel, id } = this.props;
    return (
      <div className="uk-width-1-1">
        <form
          id={id}
          className="uk-form-stacked uk-grid-small uk-child-width-1-1"
          data-uk-grid
        >
          <fieldset className="uk-fieldset uk-width-1-1">
            {this.generateFields()}
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
