import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormValidatorErrorMessage from '../FormValidatorErrorMessage';

export default class Input extends Component {
  static get propTypes() {
    return {
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      onChange: PropTypes.func.isRequired,
      title: PropTypes.string.isRequired,
      valid: PropTypes.shape({
        isInvalid: PropTypes.boolean,
        message: PropTypes.boolean,
      }).isRequired,
    };
  }

  static get defaultProps() {
    return {
      placeholder: 'Tapez votre texte',
    };
  }

  getValidClass() {
    const { valid } = this.props;
    if (valid !== undefined) {
      if (!valid.isInvalid) return '';
      return 'uk-form-danger';
    }
    return '';
  }

  inputIsEmpty() {
    const { id } = this.props;
    if (document.getElementById(id)) {
      if (document.getElementById(id).value !== '') return false;
      return true;
    }
    return true;
  }

  render() {
    const { id, name, onChange, placeholder, title, type, valid } = this.props;

    const addClasses = this.getValidClass();
    console.log(`addClasses : ${addClasses}`);

    return (
      <div className="uk-form-controls uk-padding-small">
        <label
          className={`uk-form-label ${!this.inputIsEmpty() && 'stay-small'}`}
          htmlFor={id}
        >
          {title}
        </label>
        <input
          name={name}
          type={type}
          id={id}
          placeholder={placeholder}
          onChange={onChange}
          className={`uk-input uk-form-large ${addClasses}`}
        />
        <FormValidatorErrorMessage validObj={valid} />
      </div>
    );
  }
}
