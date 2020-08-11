import React from 'react';
import PropTypes from 'prop-types';
import { Section } from '../utils';

const SubHeader = ({id, style, data}) => {
  return (
    <Section id={id} style={style}>
      <div className="uk-flex uk-flex-wrap uk-flex-middle uk-flex-center uk-flex-around">
        {data.map((item, index) =>
          <a
            key={index.toString()}
            className="uk-padding-small"
            href={item.href}
            data-uk-scroll>
            <h3 className="uk-text-primary uk-text-center uk-text-middle uk-margin-remove-vertical">{item.label}</h3>
          </a>
        )}
      </div>
    </Section>
  );
};

SubHeader.propTypes = {
  id: PropTypes.string.isRequired,
  style: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
  })).isRequired
};

SubHeader.defaultProps = {
  style: 'default'
};

export default SubHeader;
