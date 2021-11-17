import React from 'react';
import PropTypes from 'prop-types';
import FormValidatorErrorMessage from 'src/components/forms/FormValidatorErrorMessage';

const DatePicker = ({
  id,
  name,
  title,
  valid,
  hidden,
  onChange,
  disabled,
  value,
  min,
  max,
}) => {
  return (
    <div
      style={{
        padding: '15px 0',
      }}
      className={`${hidden ? 'uk-hidden' : ''}`}
    >
      <div
        className="uk-form-controls ent-select"
        style={{
          paddingTop: title ? '15px' : '2px',
          paddingBottom: '2px',
        }}
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
        <input
          className="ent-date-picker"
          id={id}
          name={name}
          value={value}
          min={min}
          max={max}
          type="date"
          onChange={onChange}
          disabled={disabled}
          hidden={hidden}
        />
      </div>
      <FormValidatorErrorMessage validObj={valid} />
    </div>
  );
};

DatePicker.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  valid: PropTypes.shape({
    isInvalid: PropTypes.bool,
    message: PropTypes.string,
  }),
  value: PropTypes.string,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  min: PropTypes.string,
  max: PropTypes.string,
};

DatePicker.defaultProps = {
  valid: undefined,
  value: '',
  min: undefined,
  max: undefined,
  disabled: false,
  hidden: false,
};

export default DatePicker;
