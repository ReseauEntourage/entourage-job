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
      handleChange: PropTypes.func.isRequired,
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

  static getClassName(valid) {
    if (valid !== undefined) {
      if (!valid.isInvalid) return 'uk-form-success';
      return 'uk-form-danger';
    }
    return '';
  }

  render() {
    const {
      id,
      name,
      type,
      placeholder,
      title,
      valid,
      handleChange,
    } = this.props;
    return (
      <div className="uk-form-controls uk-padding-small">
        <label className="uk-form-label" htmlFor={id}>
          {title}
        </label>
        <input
          name={name}
          type={type}
          id={id}
          placeholder={placeholder}
          onChange={handleChange}
          className={`uk-input uk-form-large ${() => this.getClassName(valid)}`}
        />
        <FormValidatorErrorMessage validObj={valid} />
      </div>
    );
  }
}
