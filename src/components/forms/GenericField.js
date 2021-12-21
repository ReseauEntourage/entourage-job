import React from 'react';
import ReactSelect, { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';
import DatePicker from 'src/components/forms/fields/DatePicker';
import Select from 'src/components/forms/fields/Select';
import Textarea from 'src/components/forms/fields/Textarea';
import Checkbox from 'src/components/forms/fields/Checkbox';
import Input from 'src/components/forms/fields/Input';
import FormValidatorErrorMessage from 'src/components/forms/FormValidatorErrorMessage';
import { SimpleLink } from 'src/components/utils';
import { EXTERNAL_LINKS } from 'src/constants';

let debounceTimeoutId;

const GenericField = ({
  data,
  formId,
  value,
  onChange,
  getValid,
  getValue,
}) => {
  const onChangeCustom = (event) => {
    let events = [event];
    if (data.fieldsToReset) {
      events = [
        ...events,
        ...data.fieldsToReset.map((field) => {
          return {
            target: { name: field, value: undefined, selectedIndex: 0 },
          };
        }),
      ];
    }
    onChange(events);
  };

  const parseValueToUseSelect = () => {
    let valueToUse = null;
    if (data.isMulti && Array.isArray(value) && value.length > 0) {
      valueToUse = value.map((item) => {
        return {
          value: item,
          label: item,
        };
      });
    } else if (value) {
      valueToUse = value;
    }
    return valueToUse;
  };

  const parseValueToReturnSelect = (event) => {
    let valueToReturn = null;
    if (data.isMulti && Array.isArray(event) && event.length > 0) {
      valueToReturn = event.map((item) => {
        return item.value;
      });
    } else if (event && event.value) {
      valueToReturn = event.value;
    }

    onChangeCustom({
      target: {
        name: data.name,
        value: valueToReturn,
        type: data.type,
      },
    });
  };

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
        onChange={onChangeCustom}
        disabled={data.disable ? data.disable(getValue) : data.disabled}
        hidden={data.hide ? data.hide(getValue) : data.hidden}
        autocomplete={data.autocomplete}
        min={data.min}
        max={data.max}
      />
    );
  }
  if (data.component === 'datepicker') {
    return (
      <DatePicker
        id={`${formId}-${data.id}`}
        name={data.name}
        title={data.title}
        value={value}
        valid={getValid(data.name)}
        onChange={onChangeCustom}
        min={data.min}
        max={data.max}
        disabled={data.disable ? data.disable(getValue) : data.disabled}
        hidden={data.hide ? data.hide(getValue) : data.hidden}
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
        onChange={onChangeCustom}
        disabled={data.disable ? data.disable(getValue) : data.disabled}
        hidden={data.hide ? data.hide(getValue) : data.hidden}
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
        onChange={onChangeCustom}
        disabled={data.disable ? data.disable(getValue) : data.disabled}
        hidden={data.hide ? data.hide(getValue) : data.hidden}
        maxLength={data.maxLength}
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
        onChange={onChangeCustom}
        disabled={data.disable ? data.disable(getValue) : data.disabled}
        hidden={data.hide ? data.hide(getValue) : data.hidden}
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
            J&apos;accepte les{' '}
            <SimpleLink
              isExternal
              target="_blank"
              href={EXTERNAL_LINKS.LEGAL_MENTIONS}
            >
              CGU
            </SimpleLink>
          </span>
        }
        value={value}
        valid={getValid(data.name)}
        onChange={onChangeCustom}
        disabled={data.disable ? data.disable(getValue) : data.disabled}
        hidden={data.hide ? data.hide(getValue) : data.hidden}
      />
    );
  }
  if (data.component === 'select-request-async') {
    let valueToUse = null;
    if (value) {
      if (data.isMulti) {
        valueToUse = value.every((v) => {
          return typeof v === 'object';
        })
          ? value
          : getValue(value);
      } else {
        valueToUse = typeof value === 'string' ? getValue(value) : value;
      }
    }

    const shouldHide = data.hide ? data.hide(getValue) : data.hidden;

    return (
      <div
        className={`uk-padding-small uk-padding-remove-left uk-padding-remove-right ${
          shouldHide ? ' uk-hidden' : ''
        }`}
      >
        {data.title && (
          <label className="uk-form-label" htmlFor={data.id}>
            {data.title}
          </label>
        )}
        <AsyncSelect
          id={`${formId}-${data.id}`}
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
            data.noOptionsMessage ||
            (() => {
              return `Aucun résultat`;
            })
          }
          loadOptions={(inputValue, callback) => {
            clearTimeout(debounceTimeoutId);
            debounceTimeoutId = setTimeout(() => {
              return data.loadOptions(inputValue, callback, getValue);
            }, 1000);
          }}
          isDisabled={data.disable ? data.disable(getValue) : false}
          isHidden={data.hide ? data.hide(getValue) : false}
          onChange={parseValueToReturnSelect}
        />
        <FormValidatorErrorMessage validObj={getValid(data.name)} />
      </div>
    );
  }
  if (data.component === 'select-request') {
    const shouldHide = data.hide ? data.hide(getValue) : data.hidden;

    return (
      <div
        className={`uk-padding-small uk-padding-remove-left uk-padding-remove-right ${
          shouldHide ? ' uk-hidden' : ''
        }`}
      >
        {data.title && (
          <label className="uk-form-label" htmlFor={data.id}>
            {data.title}
          </label>
        )}
        <ReactSelect
          id={`${formId}-${data.id}`}
          isMulti={data.isMulti}
          name={data.name}
          value={parseValueToUseSelect()}
          options={data.options}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder={data.placeholder || 'Sélectionnez...'}
          noOptionsMessage={
            data.noOptionsMessage ||
            (() => {
              return `Aucun résultat`;
            })
          }
          onChange={parseValueToReturnSelect}
          isDisabled={data.disable ? data.disable(getValue) : false}
          isHidden={data.hide ? data.hide(getValue) : false}
        />
        <FormValidatorErrorMessage validObj={getValid(data.name)} />
      </div>
    );
  }
  if (data.component === 'select-request-creatable') {
    const hasOptions = data.options && data.options.length > 0;

    const DropdownIndicator = (props) => {
      return <components.DropdownIndicator {...props} />;
    };

    const customComponents = {
      DropdownIndicator: hasOptions ? DropdownIndicator : null,
    };
    const shouldHide = data.hide ? data.hide(getValue) : data.hidden;

    return (
      <div
        className={`uk-padding-small uk-padding-remove-left uk-padding-remove-right ${
          shouldHide ? ' uk-hidden' : ''
        }`}
      >
        {data.title && (
          <label className="uk-form-label" htmlFor={data.id}>
            {data.title}
          </label>
        )}
        <CreatableSelect
          id={`${formId}-${data.id}`}
          components={customComponents}
          formatCreateLabel={(userInput) => {
            return `Créer "${userInput}"`;
          }}
          isMulti={data.isMulti}
          name={data.name}
          value={parseValueToUseSelect()}
          options={data.options}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder={
            data.placeholder ||
            (hasOptions ? 'Sélectionnez...' : 'Saisissez...')
          }
          noOptionsMessage={
            data.noOptionsMessage ||
            (() => {
              return hasOptions ? `Aucun résultat` : 'Saisissez un élement';
            })
          }
          onChange={parseValueToReturnSelect}
          isDisabled={data.disable ? data.disable(getValue) : false}
          isHidden={data.hide ? data.hide(getValue) : false}
        />
        <FormValidatorErrorMessage validObj={getValid(data.name)} />
      </div>
    );
  }

  if (data.component === 'heading') {
    return (
      <p className="uk-heading-divider uk-margin-top uk-margin-remove-bottom">
        {data.title}
      </p>
    );
  }
  if (data.component === 'text') {
    return (
      <p className="uk-margin-top uk-text-bold uk-text-italic">{data.title}</p>
    );
  }
  throw `component ${data.component} does not exist`; // eslint-disable-line no-throw-literal
};

GenericField.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  formId: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  getValid: PropTypes.func.isRequired,
  getValue: PropTypes.func.isRequired,
};

GenericField.defaultProps = {};

export default GenericField;
