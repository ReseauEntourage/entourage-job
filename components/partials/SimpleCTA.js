import React from 'react';
import PropTypes from 'prop-types';
import Link from "next/link";
import {Button, Section} from '../utils';

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
          button &&
          <Button
            href={button.href}
            style='primary'
            isExternal={button.external}
            newTab={button.external}
            toggle={button.modal}>
            {button.label} &gt;
          </Button>
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
    external: PropTypes.bool,
    modal: PropTypes.bool
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
