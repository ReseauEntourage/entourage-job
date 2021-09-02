import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'src/components/utils';

const FieldGroup = ({ title, fields }) => {
  return (
    <div className="uk-padding-small uk-padding-remove-left uk-padding-remove-right">
      <div
        className="uk-form-controls"
        style={{
          backgroundColor: '#e5e5e5',
          borderRadius: '7px 7px 0 0',
          fontSize: '1rem',
          border: '0px',
          borderBottom: '2px solid grey',
          paddingTop: '15px',
          padding: '0 12px 0 12px',
        }}
      >
        {title ? (
          <p
            className="uk-form-label"
            style={{
              paddingLeft: '0px',
              color: '#f66b28',
              opacity: '.8',
              fontSize: '0.8rem',
              transform: 'translateY(-26px)',
              transition: '0.8s',
            }}
          >
            {title}
          </p>
        ) : null}
        <Grid childWidths={[`1-${fields.length}`]} items={fields} />
      </div>
    </div>
  );
};

FieldGroup.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export default FieldGroup;
