import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'src/components/utils';

const FieldGroup = ({ title, fields }) => {
  return (
    <div className="uk-form-controls">
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
  );
};

FieldGroup.propTypes = {
  title: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.element).isRequired,
};

FieldGroup.defaultProps = {
  title: undefined,
};

export default FieldGroup;
