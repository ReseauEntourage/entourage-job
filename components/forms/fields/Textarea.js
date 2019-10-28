import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormValidatorErrorMessage from '../FormValidatorErrorMessage';

export default class Textarea extends Component {
  static get propTypes() {
    return {
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      onChange: PropTypes.func.isRequired,
      title: PropTypes.string.isRequired,
      valid: PropTypes.shape({
        isInvalid: PropTypes.boolean,
        message: PropTypes.boolean,
      }),
      rows: PropTypes.number,
      maxLength: PropTypes.number,
    };
  }

  static get defaultProps() {
    return {
      placeholder: 'Tapez votre texte',
      rows: 5,
      valid: undefined,
      maxLength: 1000,
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
      placeholder,
      title,
      valid,
      rows,
      onChange,
      maxLength,
    } = this.props;
    return (
      <div className="uk-form-controls">
        <label className="uk-form-label" htmlFor={id}>
          {title}
          <textarea
            id={id}
            name={name}
            rows={rows}
            placeholder={placeholder}
            maxLength={maxLength}
            onChange={onChange}
            className={`uk-textarea ${() => this.getClassName(valid)}`}
          />
        </label>
        <FormValidatorErrorMessage validObj={valid} />
      </div>
    );
  }
}