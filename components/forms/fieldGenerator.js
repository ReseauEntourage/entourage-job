import React from 'react';
import ReactSelect from 'react-select';
import AsyncSelect from 'react-select/async';
import CreatableSelect from 'react-select/creatable';
import FieldGroup from './fields/FieldGroup';
import DatePicker from './fields/DatePicker';
import Select from './fields/Select';
import Textarea from './fields/Textarea';
import Checkbox from './fields/Checkbox';
import StepperModal from '../modals/StepperModal';
import SuccessModalContent from '../modals/SuccessModalContent';
import lostPwdSchema from './schema/formLostPwd.json';
import Api from '../../Axios';
import FormWithValidationV2 from './FormWithValidation';
import Input from './fields/Input';

const generator = (
  data,
  formId,
  defaultValues,
  onChange,
  getValid,
  getValue
) => {
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
        defaultValue={defaultValues[data.id]}
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
        defaultValue={defaultValues[data.id]}
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
        defaultValue={defaultValues[data.id]}
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
        defaultValue={defaultValues[data.id]}
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
        defaultValue={defaultValues[data.id]}
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
          defaultValue={defaultValues[data.id]}
          isMulti={data.isMulti}
          openMenuOnClic={false}
          placeholder={data.placeholder || 'Sélectionner...'}
          noOptionsMessage={
            data.noOptionsMessage || ((value) => `Aucun résultat`)
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
            defaultValues &&
            defaultValues[data.id] &&
            defaultValues[data.id].map((value) => ({
              value,
              label: value,
            }))
          }
          options={data.options}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder={data.placeholder || 'Sélectionner...'}
          noOptionsMessage={
            data.noOptionsMessage || ((value) => `Aucun résultat`)
          }
          onChange={(obj) => {
            if (obj) {
              let valueToReturn = obj;
              if (Array.isArray(obj)) {
                valueToReturn = obj.map(({ value }) => value);
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
            defaultValues &&
            defaultValues[data.id] &&
            defaultValues[data.id].map((value) => ({
              value,
              label: value,
            }))
          }
          options={data.options}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder={data.placeholder || 'Sélectionner...'}
          noOptionsMessage={
            data.noOptionsMessage || ((value) => `Aucun résultat`)
          }
          onChange={(obj) => {
            if (obj) {
              let valueToReturn = obj;
              if (Array.isArray(obj)) {
                valueToReturn = obj.map(({ value }) => value);
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
      </div>
    );
  }
  // ne devrait pas se placer ici mais dans la page de mot de passe oublié
  if (data.component === 'lost-pwd') {
    return (
      <div>
        {/* creer un component lien  */}
        <a
          className="uk-text-small uk-margin-remove"
          href="#"
          data-uk-toggle="target: #modal-lost-pwd"
        >
          {data.title}
        </a>
        <StepperModal
          id="modal-lost-pwd"
          title="Mot de passe oublié ?"
          composers={[
            (closeModal, nextStep) => (
              <FormWithValidationV2
                submitText="Envoyer"
                formSchema={lostPwdSchema}
                onCancel={closeModal}
                onSubmit={(fields, setError) => {
                  Api.post('/api/v1/auth/forgot', fields)
                    .then(() => nextStep())
                    .catch(() => setError("Une erreur s'est produite"));
                }}
              />
            ),
            (closeModal) => (
              <SuccessModalContent
                closeModal={closeModal}
                text="Un e-mail vient d'être envoyé à l'adresse indiquée."
              />
            ),
          ]}
        />
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
export default generator;
