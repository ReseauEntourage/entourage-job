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

export default function(id, fields, handleChange) {
  return {
    generate(data) {
      if (data.component === 'fieldgroup') {
        return (
          <FieldGroup
            id={`${id}-${data.id}`}
            title={data.title}
            fields={data.fields.map((field) => this.generate(field))}
          />
        );
      }
      if (data.component === 'input') {
        return (
          <Input
            id={`${id}-${data.id}`}
            placeholder={data.placeholder}
            name={data.name}
            title={data.title}
            value={data.value}
            type={data.type}
            valid={fields[`valid_${data.name}`]}
            onChange={handleChange}
          />
        );
      }
      if (data.component === 'datepicker') {
        return (
          <DatePicker
            id={`${id}-${data.id}`}
            placeholder={data.placeholder}
            name={data.name}
            title={data.title}
            value={data.value}
            valid={fields[`valid_${data.name}`]}
            onChange={handleChange}
            pattern={data.pattern}
            min={data.min}
            max={data.max}
          />
        );
      }
      if (data.component === 'select') {
        let { options } = data;
        if (data.generate) {
          const { max, min, type } = data.generate;
          if (type === 'inc') {
            options = Array(max - min)
              .fill(min)
              .map((_, i) => min + i + 1);
          }
        }
        return (
          <Select
            id={`${id}-${data.id}`}
            placeholder={data.placeholder}
            name={data.name}
            title={data.title}
            options={options}
            valid={fields[`valid_${data.name}`]}
            onChange={handleChange}
          />
        );
      }
      if (data.component === 'textarea') {
        return (
          <Textarea
            id={`${id}-${data.id}`}
            name={data.name}
            row={data.row}
            title={data.title}
            type={data.type}
            value={data.value}
            placeholder={data.placeholder}
            valid={fields[`valid_${data.name}`]}
            onChange={handleChange}
          />
        );
      }
      if (data.component === 'cgu') {
        return (
          <CheckboxCGU
            id={`${id}-${data.id}`}
            name={data.name}
            title={
              <span>
                J&apos;accepte les{' '}
                <Link href="#">
                  <a>CGU</a>
                </Link>
              </span>
            }
            valid={fields[`valid_${data.name}`]}
            onChange={handleChange}
          />
        );
      }
      throw `component ${data.component} does not exist`; // eslint-disable-line no-throw-literal
    },
  };
}
