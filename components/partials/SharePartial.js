import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { IconNoSSR, GridNoSSR, Button } from '../utils';
import TAGS from '../../constants/tags';
import { event } from '../../lib/gtag';

const SharePartial = ({ padding }) => {
  const router = useRouter();

  const isCVPage = router.asPath.includes('/cv');

  return (
    <div id="share" className={!padding ? 'uk-padding-remove-vertical' : ''}>
      <p className="uk-text-center">Suivez-nous sur :</p>
      <GridNoSSR center>
        {[
          {
            name: 'facebook',
            title: 'Facebook',
            href: 'https://www.facebook.com/EntourageReseauCivique/',
            tag: isCVPage
              ? TAGS.PAGE_CV_SUIVRE_SUR_FACEBOOK_CLIC
              : TAGS.HOME_SUIVRE_SUR_FACEBOOK_CLIC,
          },
          {
            name: 'twitter',
            title: 'Twitter',
            href: 'https://twitter.com/r_entourage/',
            tag: isCVPage
              ? TAGS.PAGE_CV_SUIVRE_SUR_TWITTER_CLIC
              : TAGS.HOME_SUIVRE_SUR_TWITTER_CLIC,
          },
          {
            name: 'linkedin',
            title: 'LinkedIn',
            href: 'https://www.linkedin.com/company/association-entourage/',
            tag: isCVPage
              ? TAGS.PAGE_CV_SUIVRE_SUR_LINKEDIN_CLIC
              : TAGS.HOME_SUIVRE_SUR_LINKEDIN_CLIC,
          },
        ].map(({ name, title, href, tag }, key) => {
          return (
            <Button
              href={href}
              style="primary"
              isExternal
              newTab
              onClick={() => {
                return event(tag);
              }}
              key={key}
            >
              {title}&nbsp;
              <IconNoSSR name={name} />
            </Button>
          );
        })}
      </GridNoSSR>
    </div>
  );
};

SharePartial.propTypes = {
  padding: PropTypes.bool,
};

SharePartial.defaultProps = {
  padding: false,
};

export default SharePartial;
