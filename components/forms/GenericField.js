import React from 'react';
import ReactSelect, {components} from 'react-select';
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

const GenericField = ({data, formId, value, onChange, getValid, getValue}) => {

  const parseValueToUseSelect = () => {
    let valueToUse = null;
    if (data.isMulti && Array.isArray(value) && value.length > 0) {
      valueToUse = value.map((item) => ({
        value: item,
        label: item,
      }));
    } else if (value) {
      valueToUse = value;
    }
    return valueToUse;
  };

  const parseValueToReturnSelect = (event) => {
    let valueToReturn = null;
    if (data.isMulti && Array.isArray(event) && event.length > 0) {
      valueToReturn = event.map((item) => item.value);
    } else if (event && event.value) {
      valueToReturn = event.value;
    }
    onChange({
      target: {
        name: data.name,
        value: valueToReturn,
        type: data.type,
      },
    });
  };

  if (data.component === 'fieldgroup') {
    const {fields, title, id} = data;
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
    let {options} = data;
    if (data.generate) {
      const {max, min, type, placeholder} = data.generate;
      if (type === 'inc') {
        options = Array(max - min)
          .fill(min)
          .map((_, i) => {
            if (i === 0) return {value: null, text: placeholder};
            return {value: min + i, text: min + i};
          });
      }
      if (type === 'dec') {
        options = Array(max - min)
          .fill(max)
          .map((_, i) => {
            if (i === 0) return {value: null, text: placeholder};
            return {value: max - i, text: max - i};
          });
      }
    }

    let valueToUse = value;
    if (!valueToUse) valueToUse = options[0].value;

    return (
      <Select
        id={`${formId}-${data.id}`}
        placeholder={data.placeholder}
        name={data.name}
        title={data.title}
        value={valueToUse}
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
    let valueToUse = null;
    if (value) valueToUse = (typeof(value) === 'string') ? getValue(value) : value;

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
          value={valueToUse}
          isMulti={data.isMulti}
          openMenuOnClick={false}
          placeholder={data.placeholder || 'Sélectionnez...'}
          noOptionsMessage={
            data.noOptionsMessage || ((val) => `Aucun résultat`)
          }
          loadOptions={(inputValue, callback) =>
            data.loadOptions(inputValue, callback, getValue)
          }
          isDisabled={data.disable ? data.disable(getValue) : false}
          onChange={parseValueToReturnSelect}
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
          value={parseValueToUseSelect()}
          options={data.options}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder={data.placeholder || 'Sélectionnez...'}
          noOptionsMessage={
            data.noOptionsMessage || ((item) => `Aucun résultat`)
          }
          onChange={parseValueToReturnSelect}
        />
        <FormValidatorErrorMessage validObj={getValid(data.name)} />
      </div>
    );
  }
  if (data.component === 'select-request-creatable') {

    const hasOptions = data.options && data.options.length > 0;

    const DropdownIndicator = props => {
      return (
        <components.DropdownIndicator {...props} />
      );
    };

    const customComponents = {
      DropdownIndicator: hasOptions ? DropdownIndicator : null
    };

    return (
      <div>
        {data.title && (
          <label className="uk-form-label" htmlFor={data.id}>
            {data.title}
          </label>
        )}
        <CreatableSelect
          components={customComponents}
          formatCreateLabel={userInput => `Créer "${userInput}"`}
          isMulti={data.isMulti}
          name={data.name}
          value={parseValueToUseSelect()}
          options={data.options}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder={data.placeholder || (hasOptions ? 'Sélectionnez...' : 'Saisissez...')}
          noOptionsMessage={
            data.noOptionsMessage || ((item) => hasOptions ? `Aucun résultat` : 'Saisissez un élement')
          }
          onChange={parseValueToReturnSelect}
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

GenericField.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  formId: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  onChange: PropTypes.func.isRequired,
  getValid: PropTypes.func.isRequired,
  getValue: PropTypes.func.isRequired
};

GenericField.defaultProps = {};

export default GenericField;
