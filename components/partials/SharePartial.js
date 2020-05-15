import React from 'react';
import PropTypes from "prop-types";
import { IconNoSSR, GridNoSSR } from '../utils';

const SharePartial = ({padding}) => (
  <div id="share" className={!padding ? 'uk-padding-remove-vertical' : ''}>
    <p className="uk-text-center">Suivez-nous sur :</p>
    <GridNoSSR center>
      {[
        {
          name: 'facebook',
          title: 'Facebook',
          href: 'https://www.facebook.com/EntourageReseauCivique/',
        },
        {
          name: 'twitter',
          title: 'Twitter',
          href: 'https://twitter.com/r_entourage/',
        },
        {
          name: 'linkedin',
          title: 'LinkedIn',
          href: 'https://www.linkedin.com/company/association-entourage/',
        },
      ].map(({ name, title, href }, key) => (
        <a
          href={href}
          key={key}
          className="uk-button uk-button-primary"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'white',
            backgroundColor: '#F55F24',
            backgroundImage: 'none',
            textTransform: 'none',
            boder: null,
            padding: '0px 20px',
            borderRadius: '2px',
          }}
        >
          {title} <IconNoSSR name={name} />
        </a>
      ))}
    </GridNoSSR>
  </div>
);

SharePartial.propTypes = {
  padding: PropTypes.bool
};

SharePartial.defaultProps = {
  padding: false
};

export default SharePartial;
