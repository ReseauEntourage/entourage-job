import React from 'react';
import { Section } from '../utils';
import PropTypes from 'prop-types';
import Link from "next/link";

const SimpleCTA = ({id, style, title, text, button}) => {
  return (
    <Section id={id} style={style}>
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <h1 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-width-1-2@m uk-margin-remove-vertical">
          {title}
        </h1>
        <h4 className="uk-width-1-2@m uk-align-center uk-text-center">
          {text}
        </h4>
        <Link href={button.href}>
          <a
            className="uk-button uk-button-primary"
            style={{
              color: 'white',
              backgroundColor: '#F55F24',
              backgroundImage: 'none',
              textTransform: 'none',
              border: null,
              padding: '0px 20px',
              borderRadius: '2px',
            }}
          >
            {button.label} &gt;
          </a>
        </Link>
      </div>
    </Section>
  );
};

SimpleCTA.propTypes = {
  id: PropTypes.string.isRequired,
  style: PropTypes.string,
  title: PropTypes.element.isRequired,
  button: PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired
  }).isRequired,
  text: PropTypes.string.isRequired
};

SimpleCTA.defaultProps = {
  style: 'default'
};

export default SimpleCTA;
