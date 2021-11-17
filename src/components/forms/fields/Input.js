import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FormValidatorErrorMessage from 'src/components/forms/FormValidatorErrorMessage';

const Input = ({
  id,
  name,
  placeholder,
  title,
  type,
  valid,
  value,
  onChange,
  disabled,
  hidden,
  autocomplete,
  min,
  max,
}) => {
  const [labelClass, setLabelClass] = useState('');

  const update = (event) => {
    setLabelClass(event.target.value.length > 0 && ' stay-small');
    onChange(event);
  };

  useEffect(() => {
    setLabelClass((value && value.length > 0 && ' stay-small') || '');
  }, [value]);

  return (
    <div
      className={`uk-form-controls uk-padding-small uk-padding-remove-left uk-padding-remove-right ${
        hidden ? ' uk-hidden' : ''
      }`}
    >
      <label className={`uk-form-label ${labelClass}`} htmlFor={id}>
        {title}
      </label>
      <input
        name={name}
        type={type}
        id={id}
        value={value || ''}
        placeholder={placeholder || 'Tapez votre texte'}
        onChange={(event) => {
          return update(event);
        }}
        className={`uk-input uk-form-large ${
          valid !== undefined && valid.isInvalid ? 'uk-form-danger' : ''
        }`}
        disabled={disabled}
        autoComplete={autocomplete}
        min={min}
        max={max}
      />
      <FormValidatorErrorMessage validObj={valid} />
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  valid: PropTypes.shape({
    isInvalid: PropTypes.bool,
    message: PropTypes.string,
  }),
  value: PropTypes.string,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  autocomplete: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
};

Input.defaultProps = {
  placeholder: 'Tapez votre texte',
  valid: undefined,
  value: '',
  disabled: false,
  hidden: false,
  autocomplete: 'on',
  min: undefined,
  max: undefined,
};
export default Input;
