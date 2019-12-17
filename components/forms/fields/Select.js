import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormValidatorErrorMessage from '../FormValidatorErrorMessage';

export default class Select extends Component {
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
      defaultValue: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string).isRequired,
    };
  }

  static get defaultProps() {
    return {
      valid: undefined,
      defaultValue: undefined,
    };
  }

  componentDidMount() {
    const { defaultValue, name } = this.props;
    if (defaultValue) {
      // trick to verify field before the user update of the field
      this.handleChange({
        target: { name, value: defaultValue, type: 'input' },
      });
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

  handleChange(event) {
    const { onChange } = this.props;
    onChange(event);
  }

  render() {
    const { id, name, title, valid, options, defaultValue } = this.props;
    const transparent = !!title;
    return (
      <>
        <div
          className="uk-form-controls"
          style={
            transparent
              ? {
                  backgroundColor: '#e5e5e5',
                  borderRadius: '7px 7px 0 0',
                  fontSize: '1rem',
                  border: '0px',
                  borderBottom: '2px solid grey',
                  paddingTop: '15px',
                  paddingLeft: '12px',
                  paddingRight: '12px',
                  paddingBottom: '2px',
                }
              : {
                  paddingTop: '15px',
                  paddingBottom: '2px',
                }
          }
        >
          {title ? (
            <label
              className="uk-form-label"
              style={{
                paddingLeft: '0px',
                color: '#f66b28',
                opacity: '.8',
                fontSize: '0.8rem',
                transform: 'translateY(-26px)',
                transition: '0.8s',
              }}
              htmlFor={id}
            >
              {title}
            </label>
          ) : null}
          <select
            className="uk-select"
            onChange={(event) => this.handleChange(event)}
            name={name}
            id={id}
            defaultValue={defaultValue}
            style={{
              backgroundColor: 'transparent',
              paddingLeft: 0,
              border: 'initial',
            }}
          >
            {options.map(({ value, text }) => (
              <option value={value}>{text}</option>
            ))}
          </select>
        </div>
        <FormValidatorErrorMessage validObj={valid} />
      </>
    );
  }
}
