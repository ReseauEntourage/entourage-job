import React from 'react';
import PropTypes from 'prop-types';
import FormValidatorErrorMessage from 'src/components/forms/FormValidatorErrorMessage';

const Checkbox = ({
  id,
  name,
  value,
  onChange,
  title,
  valid,
  disabled,
  hidden,
  removePadding,
}) => {
  return (
    <div
      className={`uk-form-controls ${
        removePadding
          ? ''
          : 'uk-padding-small uk-padding-remove-left uk-padding-remove-right'
      } ${hidden ? ' uk-hidden' : ''}`}
    >
      <label htmlFor={id} className="uk-flex uk-flex-middle">
        <div>
          <input
            id={id}
            name={name}
            disabled={disabled}
            type="checkbox"
            className={`uk-checkbox${
              valid !== undefined && valid.isInvalid ? ' uk-form-danger' : ''
            }`}
            checked={value}
            onChange={(event) => {
              return onChange(event);
            }}
          />
        </div>

        <span style={{ paddingLeft: '10px' }}>{title}</span>
      </label>
      <FormValidatorErrorMessage validObj={valid} />
    </div>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool,
  removePadding: PropTypes.bool,
  title: PropTypes.node.isRequired,
  valid: PropTypes.shape({
    isInvalid: PropTypes.bool,
    message: PropTypes.string,
  }),
};
Checkbox.defaultProps = {
  valid: undefined,
  value: false,
  disabled: false,
  hidden: false,
  removePadding: false,
};

export default Checkbox;
