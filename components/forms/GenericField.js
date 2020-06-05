import React from 'react';
import ReactSelect from 'react-select';
import AsyncSelect from 'react-select/async';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';
import FieldGroup from './fields/FieldGroup';
import DatePicker from './fields/DatePicker';
import Select from './fields/Select';
import Textarea from './fields/Textarea';
import Checkbox from './fields/Checkbox';
import Input from './fields/Input';
import FormValidatorErrorMessage from "./FormValidatorErrorMessage";

const GenericField = ({ data, formId, value, onChange, getValid, getValue }) => {
  if (data.component === 'fieldgroup') {
    const { fields, title, id } = data;
    return (
      <FieldGroup
        id={`${formId}-${id}`}
        title={title}
        fields={fields.map((field) => this.generate(field))}
      />
    );
  }
  if (data.component === 'input') {
    return (
      <Input
        id={`${formId}-${data.id}`}
        placeholder={data.placeholder}
        name={data.name}
        title={data.title}
        value={value}
        type={data.type}
        valid={getValid(data.name)}
        onChange={onChange}
        disabled={data.disabled}
      />
    );
  }
  if (data.component === 'datepicker') {
    return (
      <DatePicker
        id={`${formId}-${data.id}`}
        placeholder={data.placeholder}
        name={data.name}
        title={data.title}
        value={value}
        valid={getValid(data.name)}
        onChange={onChange}
        pattern={data.pattern}
        min={data.min}
        max={data.max}
        disabled={data.disabled}
      />
    );
  }
  if (data.component === 'select') {
    let { options } = data;
    if (data.generate) {
      const { max, min, type, placeholder } = data.generate;
      if (type === 'inc') {
        options = Array(max - min)
          .fill(min)
          .map((_, i) => {
            if (i === 0) return { value: null, text: placeholder };
            return { value: min + i, text: min + i };
          });
      }
      if (type === 'dec') {
        options = Array(max - min)
          .fill(max)
          .map((_, i) => {
            if (i === 0) return { value: null, text: placeholder };
            return { value: max - i, text: max - i };
          });
      }
    }
    return (
      <Select
        id={`${formId}-${data.id}`}
        placeholder={data.placeholder}
        name={data.name}
        title={data.title}
        value={value}
        options={options}
        valid={getValid(data.name)}
        onChange={onChange}
        disabled={data.disabled}
        hidden={data.hidden}
      />
    );
  }
  if (data.component === 'textarea') {
    return (
      <Textarea
        id={`${formId}-${data.id}`}
        name={data.name}
        row={data.row}
        title={data.title}
        type={data.type}
        value={value}
        placeholder={data.placeholder}
        valid={getValid(data.name)}
        onChange={onChange}
        disabled={data.disabled}
      />
    );
  }
  if (data.component === 'checkbox') {
    return (
      <Checkbox
        id={`${formId}-${data.id}`}
        name={data.name}
        title={data.title}
        value={value}
        valid={getValid(data.name)}
        onChange={onChange}
        disabled={data.disabled}
      />
    );
  }
  if (data.component === 'cgu') {
    return (
      <Checkbox
        id={`${formId}-${data.id}`}
        name={data.name}
        title={
          <span>
            J&apos;accepte les <a>CGU</a>
          </span>
        }
        value={value}
        valid={getValid(data.name)}
        onChange={onChange}
        disabled={data.disabled}
      />
    );
  }
  if (data.component === 'select-request-async') {
    return (
      <div>
        {data.title && (
          <label className="uk-form-label" htmlFor={data.id}>
            {data.title}
          </label>
        )}
        <AsyncSelect
          cacheOptions={
            data.cacheOptions === undefined ? true : data.cacheOptions
          }
          isClearable
          defaultOptions
          defaultValue={value}
          isMulti={data.isMulti}
          openMenuOnClic={false}
          placeholder={data.placeholder || 'Sélectionner...'}
          noOptionsMessage={
            data.noOptionsMessage || ((val) => `Aucun résultat`)
          }
          loadOptions={(inputValue, callback) =>
            data.loadOptions(inputValue, callback, getValue)
          }
          isDisabled={data.disable ? data.disable(getValue) : false}
          onChange={(e) =>
            onChange({
              target: {
                name: data.name,
                value: e ? e.value : '',
                type: data.type,
              },
            })
          }
        />
      </div>
    );
  }
  if (data.component === 'select-request') {
    return (
      <div>
        {data.title && (
          <label className="uk-form-label" htmlFor={data.id}>
            {data.title}
          </label>
        )}
        <ReactSelect
          isMulti={data.isMulti}
          name={data.name}
          defaultValue={
            value && {
              value,
              label: value,
            }
          }
          options={data.options}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder={data.placeholder || 'Sélectionner...'}
          noOptionsMessage={
            data.noOptionsMessage || ((item) => `Aucun résultat`)
          }
          onChange={(obj) => {
            if (obj) {
              let valueToReturn = obj;
              if (Array.isArray(obj)) {
                valueToReturn = obj.map((item) => item.value);
              } else {
                valueToReturn = obj.value;
              }
              onChange({
                target: {
                  name: data.name,
                  value: valueToReturn,
                  type: data.type,
                },
              });
            } else console.log('pb here reactselect');
          }}
        />
        <FormValidatorErrorMessage validObj={getValid(data.name)} />
      </div>
    );
  }
  if (data.component === 'select-request-creatable') {
    return (
      <div>
        {data.title && (
          <label className="uk-form-label" htmlFor={data.id}>
            {data.title}
          </label>
        )}
        <CreatableSelect
          isMulti={data.isMulti}
          name={data.name}
          defaultValue={
            value && {
              value,
              label: value,
            }
          }
          options={data.options}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder={data.placeholder || 'Sélectionner...'}
          noOptionsMessage={
            data.noOptionsMessage || ((item) => `Aucun résultat`)
          }
          onChange={(obj) => {
            if (obj) {
              let valueToReturn = obj;
              if (Array.isArray(obj)) {
                valueToReturn = obj.map((item) => item.value);
              } else {
                valueToReturn = obj.value;
              }
              onChange({
                target: {
                  name: data.name,
                  value: valueToReturn,
                  type: data.type,
                },
              });
            } else console.log('pb here reactselect');
          }}
        />
        <FormValidatorErrorMessage validObj={getValid(data.name)} />
      </div>
    );
  }
  if (data.component === 'text') {
    return (
      <p className="uk-heading-divider uk-margin-top uk-margin-remove-bottom">
        {data.title}
      </p>
    );
  }
  throw `component ${data.component} does not exist`; // eslint-disable-line no-throw-literal
};

// TODO Change PropTypes
GenericField.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  formId: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  onChange: PropTypes.func.isRequired,
  getValid: PropTypes.bool.isRequired,
  getValue: PropTypes.any.isRequired
};

GenericField.defaultProps = {

};

export default GenericField;
