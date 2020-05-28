import React from 'react';
import PropTypes from "prop-types";
import {IconNoSSR, GridNoSSR, Button} from '../utils';

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
        <Button
          href={href}
          style='primary'
          isExternal
          newTab
          key={key}>
          {title} <IconNoSSR name={name} />
        </Button>
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
