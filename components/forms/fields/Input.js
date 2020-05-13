import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FormValidatorErrorMessage from '../FormValidatorErrorMessage';

const Input = ({
  id,
  name,
  placeholder,
  title,
  type,
  valid,
  defaultValue,
  onChange,
  disabled,
}) => {
  const [labelClass, setLabelClass] = useState('');
  const [value, setValue] = useState(defaultValue);

  const update = (event) => {
    setLabelClass(event.target.value.length > 0 && ' stay-small');
    setValue(event.target.value);
    onChange(event);
  };

  useEffect(() => {
    setValue(defaultValue || '');
    setLabelClass(
      (defaultValue && defaultValue.length > 0 && ' stay-small') || ''
    );
    onChange({ target: { name, value: defaultValue || '', type: 'input' } });
  }, [defaultValue]);

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
        defaultValue={defaultValue}
        placeholder={placeholder || 'Tapez votre texte'}
        onChange={(event) => update(event)}
        className={`uk-input uk-form-large ${
          valid !== undefined && valid.isInvalid ? 'uk-form-danger' : ''
        }`}
        disabled={disabled}
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
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
};

Input.defaultProps = {
  placeholder: 'Tapez votre texte',
  valid: undefined,
  defaultValue: '',
  disabled: false,
};
export default Input;
