import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { event } from 'src/lib/gtag';
import TAGS from 'src/constants/tags';
import { IconNoSSR } from 'src/components/utils/Icon';

const Carousel = ({ style, children, containerClasses }) => {
  const router = useRouter();

  let tag;

  if (router.asPath.includes('/recruter')) {
    tag = TAGS.PAGE_RECRUTER_CARROUSEL_CLIC;
  }
  if (router.asPath.includes('/travailler')) {
    tag = TAGS.PAGE_TRAVAILLER_CARROUSEL_CLIC;
  }
  if (router.asPath.includes('/orienter')) {
    tag = TAGS.PAGE_ORIENTER_CARROUSEL_CLIC;
  }

  return (
    <div
      className="uk-position-relative"
      data-uk-slider="autoplay: true; autoplay-interval: 5000; pause-on-hover: true;"
      style={{ maxWidth: '100%' }}
    >
      <div className={`uk-slider-container uk-background-${style}`}>
        <ul className={`uk-slider-items ${containerClasses}`}>{children}</ul>
      </div>
      <ul className="uk-slider-nav uk-dotnav uk-flex-center uk-margin" />
      <div className="uk-hidden uk-light">
        <a
          href="#"
          className="uk-position-center-left uk-position-small"
          uk-slider-item="previous"
          onClick={() => {
            if (tag) {
              event(tag);
            }
          }}
        >
          <IconNoSSR
            className="uk-icon-button uk-overlay-default"
            name="chevron-left"
            ratio={2}
          />
        </a>
        <a
          href="#"
          className="uk-position-center-right uk-position-small"
          uk-slider-item="next"
          onClick={() => {
            if (tag) {
              event(tag);
            }
          }}
        >
          <IconNoSSR
            className="uk-icon-button uk-overlay-default"
            name="chevron-right"
            ratio={2}
          />
        </a>
      </div>
      <div className="uk-visible@m">
        <a
          href="#"
          className="uk-position-center-left-out uk-position-small"
          uk-slider-item="previous"
          onClick={() => {
            if (tag) {
              event(tag);
            }
          }}
        >
          <IconNoSSR
            className="uk-text-primary"
            name="chevron-left"
            ratio={3}
          />
        </a>
        <a
          href="#"
          className="uk-position-center-right-out  uk-position-small"
          uk-slider-item="next"
          onClick={() => {
            if (tag) {
              event(tag);
            }
          }}
        >
          <IconNoSSR
            className="uk-text-primary"
            name="chevron-right"
            ratio={3}
          />
        </a>
      </div>
    </div>
  );
};

Carousel.propTypes = {
  style: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  containerClasses: PropTypes.string.isRequired,
};
Carousel.defaultProps = {
  style: 'default',
};

export default Carousel;
