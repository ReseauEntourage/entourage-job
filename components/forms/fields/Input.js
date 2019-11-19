import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormValidatorErrorMessage from '../FormValidatorErrorMessage';

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelClass: '',
      value: '',
    };
  }

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
      }),
      value: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      placeholder: 'Tapez votre texte',
      valid: undefined,
      value: '',
    };
  }

  componentWillReceiveProps() {
    const { value } = this.props;
    this.setState({ value });
    this.setLabelClass(value);
  }

  getValidClass() {
    const { valid } = this.props;
    if (valid !== undefined) {
      if (!valid.isInvalid) return '';
      return 'uk-form-danger';
    }
    return '';
  }

  setLabelClass(value) {
    this.setState({
      labelClass: value.length > 0 ? ' stay-small' : '',
    });
  }

  handleChange(event) {
    const { onChange } = this.props;
    onChange(event);
    this.setState({ value: event.target.value });
    this.setLabelClass(event.target.value);
  }

  render() {
    const { id, name, placeholder, title, type, valid } = this.props;
    const { labelClass, value } = this.state;

    const addClasses = this.getValidClass();

    return (
      <div className="uk-form-controls uk-padding-small uk-padding-remove-left uk-padding-remove-right">
        <label className={`uk-form-label ${labelClass}`} htmlFor={id}>
          {title}
        </label>
        <input
          name={name}
          type={type}
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={(event) => this.handleChange(event)}
          className={`uk-input uk-form-large ${addClasses}`}
        />
        <FormValidatorErrorMessage validObj={valid} />
      </div>
    );
  }
}
