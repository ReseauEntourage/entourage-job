import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormValidatorErrorMessage from '../FormValidatorErrorMessage';

export default class Textarea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelClass: '',
    };
  }

  static get propTypes() {
    return {
      id: PropTypes.string,
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
      defaultValue: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      id: undefined,
      placeholder: 'Tapez votre texte',
      rows: 5,
      valid: undefined,
      maxLength: 1000,
      defaultValue: '',
    };
  }

  componentDidMount() {
    const { name, defaultValue, onChange } = this.props;
    if (defaultValue) {
      this.setLabelClass(defaultValue);
      onChange({ target: { name, value: defaultValue, type: 'textarea' } });
    }
  }

  setLabelClass(value) {
    this.setState({
      labelClass: value.length > 0 ? ' stay-small' : '',
    });
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
    /** Cette condition est indispensable avant de faire appel a document
     * car le rendu a lieu côté serveur et n'a pas de document de défini.
     * Source : https://stackoverflow.com/questions/35068451/reactjs-document-is-not-defined */
    if (typeof window !== 'undefined') {
      if (document.getElementById(id)) {
        if (document.getElementById(id).value !== '') return false;
        return true;
      }
    }
    return true;
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
      defaultValue,
    } = this.props;
    const { labelClass } = this.state;

    const addClasses = this.getValidClass();
    return (
      <div className="uk-form-controls uk-padding-small uk-padding-remove-left uk-padding-remove-right">
        <label className={`uk-form-label ${labelClass}`} htmlFor={id}>
          {title}
        </label>
        <textarea
          id={id}
          name={name}
          rows={rows}
          placeholder={placeholder || 'Tapez votre texte'}
          maxLength={maxLength}
          defaultValue={defaultValue}
          onChange={(e) => {
            this.setLabelClass(e.target.value);
            onChange(e);
          }}
          className={`uk-textarea uk-form-large ${addClasses}`}
        />
        <FormValidatorErrorMessage validObj={valid} />
      </div>
    );
  }
}
