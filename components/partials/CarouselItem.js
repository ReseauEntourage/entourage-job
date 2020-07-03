import React from "react";
import PropTypes from 'prop-types';

import Grid from "../utils/Grid";

const CarouselItem = ({index, img, description}) => {
  return (
    <li key={index.toString()}>
      <Grid
        childWidths={[`1-2@m`]}
        match
        center
        middle
        gap='collapse'
        className="uk-flex-wrap uk-flex-wrap-middle">
        <div
          className="uk-flex-1 uk-background-position-center-center uk-background-cover uk-height-medium"
          style={{backgroundImage: `url(${img})`}} />
        <div className="uk-flex uk-flex-1 uk-flex-center uk-flex-middle uk-padding-large">
          <div className="uk-flex uk-flex-center uk-flex-middle uk-height-small">
            {description}
          </div>
        </div>
      </Grid>
    </li>
  );
};


CarouselItem.propTypes = {
  index: PropTypes.number.isRequired,
  img: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

CarouselItem.defaultProps = {
};

export default CarouselItem;
