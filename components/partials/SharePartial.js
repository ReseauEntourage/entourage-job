import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { IconNoSSR, GridNoSSR, Button } from '../utils';
import TAGS from '../../constants/tags';
import { event } from '../../lib/gtag';

const SharePartial = ({ showTitle, padding }) => {
  const router = useRouter();

  const isCVPage = router.asPath.includes('/cv');

  return (
    <div id="share" className={!padding ? 'uk-padding-remove-vertical' : ''}>
      {showTitle && <p className="uk-text-center">Suivez-nous sur :</p>}
      <GridNoSSR center>
        {[
          {
            name: 'facebook',
            title: 'Facebook',
            href: 'https://www.facebook.com/linkedout.vendeeglobe',
            tag: isCVPage
              ? TAGS.PAGE_CV_SUIVRE_SUR_FACEBOOK_CLIC
              : TAGS.HOME_SUIVRE_SUR_FACEBOOK_CLIC,
          },
          {
            name: 'twitter',
            title: 'Twitter',
            href: 'https://twitter.com/linkedout_vg',
            tag: isCVPage
              ? TAGS.PAGE_CV_SUIVRE_SUR_TWITTER_CLIC
              : TAGS.HOME_SUIVRE_SUR_TWITTER_CLIC,
          },
          {
            name: 'linkedin',
            title: 'LinkedIn',
            href:
              'https://www.linkedin.com/company/linkedout-vend%C3%A9e-globe/',
            tag: isCVPage
              ? TAGS.PAGE_CV_SUIVRE_SUR_LINKEDIN_CLIC
              : TAGS.HOME_SUIVRE_SUR_LINKEDIN_CLIC,
          },
          {
            name: 'instagram',
            title: 'Instagram',
            href: 'https://www.instagram.com/linkedout.vendeeglobe/',
            tag: isCVPage
              ? TAGS.PAGE_CV_SUIVRE_SUR_INSTAGRAM_CLIC
              : TAGS.HOME_SUIVRE_SUR_INSTAGRAM_CLIC,
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
  showTitle: PropTypes.bool,
};

SharePartial.defaultProps = {
  padding: false,
  showTitle: true,
};

export default SharePartial;
