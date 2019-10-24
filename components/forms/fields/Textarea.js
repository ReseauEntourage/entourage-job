import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormValidatorErrorMessage from '../FormValidatorErrorMessage';

export default class Input extends Component {
  static get propTypes() {
    return {
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      handleChange: PropTypes.func.isRequired,
      title: PropTypes.string.isRequired,
      valid: PropTypes.shape({
        isInvalid: PropTypes.boolean,
        message: PropTypes.boolean,
      }).isRequired,
      rows: PropTypes.number,
    };
  }

  static get defaultProps() {
    return {
      rows: 5,
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
      rows,
      handleChange,
    } = this.props;
    return (
      <div className="uk-form-controls">
        <label className="uk-form-label" htmlFor={id}>
          {title}
          <textarea
            id={id}
            name={name}
            type={type}
            rows={rows}
            placeholder={placeholder}
            onChange={handleChange}
            className={`uk-textarea ${this.getClass(valid)}`}
          />
        </label>
        <FormValidatorErrorMessage valid_obj={valid} />
      </div>
    );
  }
}
