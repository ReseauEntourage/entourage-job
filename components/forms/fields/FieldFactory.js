/* eslint-disable camelcase */
/* eslint-disable default-case */
import React from 'react';
import Link from 'next/link';
import DatePicker from './DatePicker';
import Select from './Select';
import FieldGroup from './FieldGroup';
import Input from './Input';
import Textarea from './Textarea';
import CheckboxCGU from './CheckboxCGU';

export default class FieldFactory {
  constructor(id, fields, defaultValues, handleChange, getValid) {
    this.generate = this.generate.bind(this);
    this.id = id;
    this.fields = fields;
    this.handleChange = handleChange;
    this.defaultValues = defaultValues;
    this.getValid = getValid;
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
        />
      );
    }
    if (data.component === 'cgu') {
      return (
        <CheckboxCGU
          id={`${this.id}-${data.id}`}
          name={data.name}
          title={
            <span>
              J&apos;accepte les{' '}
              <Link href="#">
                <a>CGU</a>
              </Link>
            </span>
          }
          valid={this.getValid(data.name)}
          onChange={this.handleChange}
        />
      );
    }
    throw `component ${data.component} does not exist`; // eslint-disable-line no-throw-literal
  }
}
