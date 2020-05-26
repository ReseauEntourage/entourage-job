import React from 'react';
import PropTypes from 'prop-types';
import Link from "next/link";
import { Section } from '../utils';

const SimpleCTA = ({id, style, title, text, button, children}) => {
  return (
    <Section container="small" style={style}>
      {/* Fix so that the anchor scroll to the right height */}
      <div id={id} style={{marginTop: -140, paddingTop: 140}} />
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
          {title}
        </h2>
        <h3 className="uk-align-center uk-text-center">
          {text}
        </h3>
        {
          button && <Link href={button.href}>
            <a
              className="uk-button uk-button-primary"
              target="_blank"
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
        }
        {children}
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
    href: PropTypes.string.isRequired,
    external: PropTypes.bool
  }),
  text: PropTypes.string.isRequired,
  children: PropTypes.element
};

SimpleCTA.defaultProps = {
  style: 'default',
  button: undefined,
  children: undefined
};

export default SimpleCTA;
