import React from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR } from '../../utils';

const FieldGroup = ({ title, fields }) => (
  <div className="uk-form-controls uk-padding-small uk-padding-remove-left uk-padding-remove-right">
    {title ? <p className="uk-form-label">{title}</p> : null}
    <GridNoSSR childWidths={[`1-${fields.length}`]} items={fields} />
  </div>
);

FieldGroup.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export default FieldGroup;
