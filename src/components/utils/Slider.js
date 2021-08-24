import React from 'react';
import PropTypes from 'prop-types';

const Slider = ({ grid, items, childWidths, finite, autoplay }) => {
  let classBuffer2 = 'uk-slider-items';
  if (grid) classBuffer2 += ` uk-grid-small`;
  childWidths.forEach((size) => {
    return (classBuffer2 += ` uk-child-width-${size}`);
  });
  return (
    <div
      className="uk-position-relative uk-visible-toggle uk-padding"
      tabIndex="-1"
      data-uk-slider={`finite: ${finite}; autoplay: ${autoplay}`}
    >
      <ul className={classBuffer2} data-uk-grid>
        {items.map((item, index) => {
          return <li key={index}>{item}</li>;
        })}
      </ul>
      <a
        className="uk-position-center-left uk-position-small uk-hidden-hover"
        href="#"
        aria-label="précedent"
        data-uk-slidenav-previous
        data-uk-slider-item="previous"
      />
      <a
        className="uk-position-center-right uk-position-small uk-hidden-hover"
        href="#"
        aria-label="suivant"
        data-uk-slidenav-next
        data-uk-slider-item="next"
      />
    </div>
  );
};
Slider.propTypes = {
  grid: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.element).isRequired,
  childWidths: PropTypes.arrayOf(PropTypes.string),
  finite: PropTypes.bool,
  autoplay: PropTypes.bool,
};
Slider.defaultProps = {
  grid: undefined,
  childWidths: [],
  finite: undefined,
  autoplay: undefined,
};
export const SliderNoSSR = Slider;
export default Slider;
