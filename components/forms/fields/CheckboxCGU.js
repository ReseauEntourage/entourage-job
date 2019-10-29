import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormValidatorErrorMessage from '../FormValidatorErrorMessage';

export default class CheckboxCGU extends Component {
  static get propTypes() {
    return {
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      title: PropTypes.node.isRequired,
      valid: PropTypes.shape({
        isInvalid: PropTypes.boolean,
        message: PropTypes.boolean,
      }),
    };
  }

  static get defaultProps() {
    return {
      valid: undefined,
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

  render() {
    const { id, name, onChange, title, valid } = this.props;

    const addClasses = this.getValidClass();

    return (
      <div className="uk-form-controls uk-padding-small">
        <input
          id={id}
          name={name}
          type="checkbox"
          onChange={onChange}
          className={`uk-checkbox ${addClasses}`}
        />
        <label htmlFor={id} style={{ paddingLeft: '10px' }}>
          {title}
        </label>
        <FormValidatorErrorMessage validObj={valid} />
      </div>
    );
  }
}
