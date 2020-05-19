import React from 'react';
import PropTypes from 'prop-types';

const ImageTitle = ({id, title, text}) => {
  return (
    <div id={id} className="uk-section uk-padding-remove-vertical uk-background-muted">
      <div className="uk-container-expand uk-height-large uk-background-image uk-background-top-center uk-background-norepeat uk-background-cover uk-height-max-large uk-flex uk-flex-bottom" style={{backgroundImage: "url('static/img/illustrations/header_pic.jpg')"}}>
        <div
          className="uk-width-1-2@m uk-align-center uk-background-default uk-padding uk-margin-remove-top"
          style={{marginBottom: -90}}>
          <h1 className="uk-text-center uk-align-center uk-text-bold">
            {title}
          </h1>
          <h3 className="uk-text-center uk-text-bold uk-align-center uk-margin-remove-vertical">
            {text}
          </h3>
        </div>
      </div>
      <div style={{height: 70}}/>
    </div>
  );
};

ImageTitle.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired
};

ImageTitle.defaultProps = {
  style: 'muted'
};

export default ImageTitle;
