import React from "react";
import PropTypes from "prop-types";
import {IconNoSSR} from "./Icon";

const Carousel = ({style, children, containerClasses}) => (
  <div className="uk-position-relative" data-uk-slider="">
    <div className={`uk-slider-container uk-background-${style}`}>
      <ul className={`uk-slider-items ${containerClasses}`}>
        {children}
      </ul>
    </div>
    <ul className="uk-slider-nav uk-dotnav uk-flex-center uk-margin" />
    <div className="uk-hidden@m">
      <a
        href="#"
        className="uk-position-center-left uk-position-small"
        uk-slider-item="previous"
      >
        <IconNoSSR
          className="uk-text-primary uk-icon-button uk-overlay-default"
          name="chevron-left"
          ratio={2}
        />
      </a>
      <a
        href="#"
        className="uk-position-center-right uk-position-small"
        uk-slider-item="next"
      >
        <IconNoSSR
          className="uk-text-primary uk-icon-button uk-overlay-default"
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

Carousel.propTypes = {
  style: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  containerClasses: PropTypes.string.isRequired
};
Carousel.defaultProps = {
  style: 'default'
};

export default Carousel;
