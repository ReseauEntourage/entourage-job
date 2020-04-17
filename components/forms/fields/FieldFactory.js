/* eslint-disable camelcase */
/* eslint-disable default-case */
import React from 'react';
import Link from 'next/link';
import ReactSelect from 'react-select';
import AsyncSelect from 'react-select/async';
import CreatableSelect from 'react-select/creatable';
import Api from '../../../Axios';
import DatePicker from './DatePicker';
import Select from './Select';
import FieldGroup from './FieldGroup';
import Input from './Input';
import Textarea from './Textarea';
import Checkbox from './Checkbox';
import StepperModal from '../../modals/StepperModal';
import SuccessModalContent from '../../modals/SuccessModalContent';
import FormWithValidation from '../FormWithValidation';
import lostPwdSchema from '../schema/formLostPwd.json';

export default class FieldFactory {
  constructor(id, fields, defaultValues, handleChange, getValid, getValue) {
    this.generate = this.generate.bind(this);
    this.id = id;
    this.fields = fields;
    this.handleChange = handleChange;
    this.defaultValues = defaultValues;
    this.getValid = getValid;
    this.getValue = getValue;
  }

  generate(data) {
    if (data.component === 'fieldgroup') {
      const { fields, title, id } = data;
      return (
        <FieldGroup
          id={`${this.id}-${id}`}
          title={title}
          fields={fields.map((field) => this.generate(field))}
        />
      );
    }
    if (data.component === 'input') {
      return (
        <Input
          id={`${this.id}-${data.id}`}
          placeholder={data.placeholder}
          name={data.name}
          title={data.title}
          defaultValue={this.defaultValues[data.id]}
          type={data.type}
          valid={this.getValid(data.name)}
          onChange={this.handleChange}
          disabled={data.disabled}
        />
      );
    }
    if (data.component === 'datepicker') {
      return (
        <DatePicker
          id={`${this.id}-${data.id}`}
          placeholder={data.placeholder}
          name={data.name}
          title={data.title}
          defaultValue={this.defaultValues[data.id]}
          valid={this.getValid(data.name)}
          onChange={this.handleChange}
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
          id={`${this.id}-${data.id}`}
          placeholder={data.placeholder}
          name={data.name}
          title={data.title}
          defaultValue={this.defaultValues[data.id]}
          options={options}
          valid={this.getValid(data.name)}
          onChange={this.handleChange}
          disabled={data.disabled}
          hidden={data.hidden}
        />
      );
    }
    if (data.component === 'textarea') {
      return (
        <Textarea
          id={`${this.id}-${data.id}`}
          name={data.name}
          row={data.row}
          title={data.title}
          type={data.type}
          defaultValue={this.defaultValues[data.id]}
          placeholder={data.placeholder}
          valid={this.getValid(data.name)}
          onChange={this.handleChange}
          disabled={data.disabled}
        />
      );
    }
    if (data.component === 'checkbox') {
      return (
        <Checkbox
          id={`${this.id}-${data.id}`}
          name={data.name}
          title={data.title}
          defaultValue={this.defaultValues[data.id]}
          valid={this.getValid(data.name)}
          onChange={this.handleChange}
          disabled={data.disabled}
        />
      );
    }
    if (data.component === 'cgu') {
      return (
        <Checkbox
          id={`${this.id}-${data.id}`}
          name={data.name}
          title={
            <span>
              J&apos;accepte les <a>CGU</a>
            </span>
          }
          valid={this.getValid(data.name)}
          onChange={this.handleChange}
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
            defaultValue={this.defaultValues[data.id]}
            isMulti={data.isMulti}
            openMenuOnClic={false}
            placeholder={data.placeholder || 'Sélectionner...'}
            noOptionsMessage={
              data.noOptionsMessage || ((value) => `Aucun résultat`)
            }
            loadOptions={(inputValue, callback) =>
              data.loadOptions(inputValue, callback, this.getValue)
            }
            isDisabled={data.disable ? data.disable(this.getValue) : false}
            onChange={(e) =>
              this.handleChange({
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
              this.defaultValues &&
              this.defaultValues[data.id] &&
              this.defaultValues[data.id].map((value) => ({
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
                this.handleChange({
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
              this.defaultValues &&
              this.defaultValues[data.id] &&
              this.defaultValues[data.id].map((value) => ({
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
                this.handleChange({
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
    if (data.component === 'lost-pwd') {
      return (
        <div>
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
                <FormWithValidation
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
  }
}
