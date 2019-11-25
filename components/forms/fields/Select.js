import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormValidatorErrorMessage from '../FormValidatorErrorMessage';

export default class Select extends Component {
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
      onChange: PropTypes.func.isRequired,
      title: PropTypes.string.isRequired,
      valid: PropTypes.shape({
        isInvalid: PropTypes.boolean,
        message: PropTypes.boolean,
      }),
      value: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string).isRequired,
    };
  }

  static get defaultProps() {
    return {
      valid: undefined,
      value: undefined,
    };
  }

  componentDidMount() {
    const { value, name } = this.props;
    if (value) {
      this.setLabelClass(value);
      // trick to verify field before the user update of the field
      this.handleChange({ target: { name, value, type: 'input' } });
    }
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
      // labelClass: ' stay-small',
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
    const { id, name, title, valid, options, value } = this.props;
    const { labelClass } = this.state;

    return (
      <div className="uk-form-controls uk-padding-small uk-padding-remove-left uk-padding-remove-right">
        <label
          className={`uk-form-label ${labelClass}`}
          htmlFor={id}
          // style={{ top: '6px' }}
        >
          {title}
        </label>
        <div className="uk-margin">
          <select
            className="uk-select"
            onChange={(event) => this.handleChange(event)}
            name={name}
            id={id}
            defaultValue={value}
          >
            {options.map(({ value, text }) => (
              <option value={value}>{text}</option>
            ))}
          </select>
        </div>
        <FormValidatorErrorMessage validObj={valid} />
      </div>
    );
  }
}
