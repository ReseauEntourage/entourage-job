import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormValidatorErrorMessage from '../FormValidatorErrorMessage';

// TODO complete the class
export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelClass: '',
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
        message: PropTypes.string,
      }),
      defaultValue: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      placeholder: 'Tapez votre texte',
      valid: undefined,
      defaultValue: '',
    };
  }

  componentDidMount() {
    // const { value, name } = this.props;
    // if (value) {
    //   this.setLabelClass(value);
    //   // trick to verify field before the user update of the field
    //   this.handleChange({ target: { name, value, type: 'input' } });
    // }
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
    const { value } = event.target;
    const { onChange } = this.props;
    onChange(event);
    this.setLabelClass(value);
  }

  render() {
    const {
      id,
      name,
      placeholder,
      title,
      type,
      valid,
      defaultValue,
    } = this.props;
    const { labelClass } = this.state;

    const addClasses = this.getValidClass();

    return (
      <div className="uk-form-controls uk-padding-small uk-padding-remove-left uk-padding-remove-right">
        <label className={`uk-form-label ${labelClass}`} htmlFor={id}>
          {title}
        </label>
        <div>
          <input
            name={name}
            type={type}
            id={id}
            defaultValue={defaultValue}
            placeholder={placeholder || 'Tapez votre texte'}
            onChange={(event) => this.handleChange(event)}
            className={`uk-input uk-form-large ${addClasses}`}
          />
        </div>
        <FormValidatorErrorMessage validObj={valid} />
      </div>
    );
  }
}
