import React from "react";
import PropTypes from "prop-types";
import {IconNoSSR} from "./Icon";

const Carousel = ({style, items, itemRenderer, containerClasses}) => (
  <div className="uk-position-relative" data-uk-slider="">
    <div className={`uk-slider-container uk-background-${style}`}>
      <ul className={`uk-slider-items ${containerClasses}`}>
        {items.map((item, index) => itemRenderer(item, index))}
      </ul>
      <ul className="uk-slider-nav uk-dotnav uk-flex-center uk-margin" />
    </div>
    <div className="uk-hidden@l">
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
    <div className="uk-visible@l">
      <a
        href="#"
        className="uk-position-center-left-out uk-position-small"
        uk-slider-item="previous"
      >
        <IconNoSSR
          className="uk-text-primary"
          name="chevron-left"
          ratio={2}
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
          ratio={2}
        />
      </a>
    </div>
  </div>
);

Carousel.propTypes = {
  style: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  itemRenderer: PropTypes.func.isRequired,
  containerClasses: PropTypes.string.isRequired
};
Carousel.defaultProps = {
  style: 'default'
};

export default Carousel;
