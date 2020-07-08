import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import FormValidatorErrorMessage from '../FormValidatorErrorMessage';

const Select = ({
  id,
  name,
  title,
  valid,
  options,
  value,
  onChange,
  disabled,
  hidden,
}) => {

  return (
    <>
      <div
        className={`uk-form-controls ent-select${hidden ? ' uk-hidden' : ''}`}
        style={{
          paddingTop: '15px',
          paddingBottom: '2px',
          margin: '15px 0',
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
        <select
          className="uk-select"
          onChange={(event) => onChange(event)}
          name={name}
          id={id}
          value={value}
          style={{
            backgroundColor: 'transparent',
            paddingLeft: 0,
            border: 'initial',
          }}
          disabled={disabled}
        >
          {
            options.map((item, i) => {
              return (
                !item.hidden ?
                  <option value={item.value} key={i}>
                    {item.label}
                  </option>
                  :
                  undefined
              );
            }
          )}
        </select>
      </div>
      <FormValidatorErrorMessage validObj={valid} />
    </>
  );
};
Select.defaultProps = {
  valid: undefined,
  value: undefined,
  disabled: false,
  onChange: () => {},
  hidden: false,
};

Select.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  title: PropTypes.string.isRequired,
  valid: PropTypes.shape({
    isInvalid: PropTypes.bool,
    message: PropTypes.string,
  }),
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.objectOf({
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
      ]),
      label: PropTypes.string,
    })
  ).isRequired,
  hidden: PropTypes.bool,
};
export default Select;
