import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR } from '../../utils';
import FormValidatorErrorMessage from '../FormValidatorErrorMessage';

export default class DatePicker extends Component {
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
      placeholder: PropTypes.string,
      onChange: PropTypes.func.isRequired,
      title: PropTypes.string.isRequired,
      valid: PropTypes.shape({
        isInvalid: PropTypes.boolean,
        message: PropTypes.string,
      }),
      value: PropTypes.string,
      min: PropTypes.string,
      max: PropTypes.string,
      pattern: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      placeholder: 'Tapez votre texte',
      valid: undefined,
      value: '',
      min: undefined,
      max: undefined,
      pattern: undefined,
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
      labelClass: ' stay-small',
      // labelClass: value.length > 0 ? ' stay-small' : '',
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
      valid,
      value,
      min,
      max,
      pattern,
    } = this.props;
    const { labelClass } = this.state;

    return (
      <div className="uk-form-controls uk-padding-small uk-padding-remove-left uk-padding-remove-right">
        <label
          className="uk-form-label stay-small"
          htmlFor={id}
          style={{ top: '6px' }}
        >
          {title}
        </label>
        <GridNoSSR
          childWidths={['1-2']}
          items={[
            <div className="uk-margin">
              <select
                className="uk-select"
                onChange={(event) => this.handleChange(event)}
                name={`${id}-mounth`}
              >
                <option />
                {[
                  'janvier',
                  'fevrier',
                  'mars',
                  'avril',
                  'mai',
                  'juin',
                  'juillet',
                ].map((month, index) => (
                  <option key={index} value={month}>
                    {month.charAt(0).toUpperCase() + month.slice(1)}
                  </option>
                ))}
              </select>
            </div>,
            <div className="uk-margin">
              <select
                className="uk-select"
                onChange={(event) => this.handleChange(event)}
                name={`${id}-year`}
              >
                <option>Selectionnez l&apos;année...</option>
                {Array(max - min)
                  .fill(min)
                  .map((val, i) => (
                    <option value={Number(val) + i}>{Number(val) + i}</option>
                  ))}
              </select>
            </div>,
          ]}
        />
        <FormValidatorErrorMessage validObj={valid} />
      </div>
    );
  }
}
