import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormValidatorErrorMessage from '../FormValidatorErrorMessage';

const CheckboxCGU = ({
  id,
  name,
  defaultValue,
  onChange,
  title,
  valid,
  disabled,
}) => {
  const [checked, setChecked] = useState(defaultValue);

  return (
    <div className="uk-form-controls uk-padding-small uk-padding-remove-left uk-padding-remove-right">
      <label htmlFor={id}>
        <input
          id={id}
          name={name}
          disabled={disabled}
          type="checkbox"
          className={`uk-checkbox${
            valid !== undefined && valid.isInvalid ? ' uk-form-danger' : ''
          }`}
          checked={checked}
          // defaultChecked={defaultValue}
          onChange={() => {
            onChange({
              target: { name, checked: !checked, type: 'checkbox' },
            });
            setChecked(!checked);
          }}
        />
        <span style={{ paddingLeft: '10px' }}>{title}</span>
      </label>
      <FormValidatorErrorMessage validObj={valid} />
    </div>
  );
};

CheckboxCGU.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.bool,
  title: PropTypes.node.isRequired,
  valid: PropTypes.shape({
    isInvalid: PropTypes.bool,
    message: PropTypes.bool,
  }),
};
CheckboxCGU.defaultProps = {
  valid: undefined,
  defaultValue: false,
};

export default CheckboxCGU;
