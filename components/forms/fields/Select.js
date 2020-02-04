import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import FormValidatorErrorMessage from '../FormValidatorErrorMessage';

const Select = ({
  id,
  name,
  title,
  valid,
  options,
  defaultValue,
  onChange,
}) => {
  useEffect(() => {
    if (defaultValue) {
      // trick to verify field before the user update of the field
      onChange({
        target: { name, value: defaultValue, type: 'input' },
      });
    }
  }, [defaultValue]);

  return (
    <>
      <div
        className="uk-form-controls ent-select"
        style={
          title
            ? {
                paddingTop: '15px',
                paddingBottom: '2px',
              }
            : {}
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
          onChange={(event) => onChange(event)}
          name={name}
          id={id}
          value={defaultValue}
          style={{
            backgroundColor: 'transparent',
            paddingLeft: 0,
            border: 'initial',
          }}
        >
          {options.map(({ value, text }, i) => (
            <option value={value} key={i}>
              {text}
            </option>
          ))}
        </select>
      </div>
      <FormValidatorErrorMessage validObj={valid} />
    </>
  );
};
Select.defaultProps = {
  valid: undefined,
  defaultValue: undefined,
  onChange: () => {},
};
Select.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  title: PropTypes.string.isRequired,
  valid: PropTypes.shape({
    isInvalid: PropTypes.bool,
    message: PropTypes.bool,
  }),
  defaultValue: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.objectOf({
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
      ]),
      text: PropTypes.string,
    })
  ).isRequired,
};
export default Select;
