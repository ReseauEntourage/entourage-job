import React from 'react';
import PropTypes from 'prop-types';

const ImageTitle = ({id, title, text}) => {
  return (
    <div id={id} className="uk-section uk-padding-remove-top uk-background-muted">
      <div className="uk-container-expand uk-height-large uk-background-image uk-background-top-center uk-background-norepeat uk-background-cover uk-height-max-large uk-flex uk-flex-bottom" style={{backgroundImage: "url('static/img/illustrations/header_pic.jpg')"}}>
        <div
          className="uk-container-large uk-align-center uk-background-default uk-padding uk-margin-remove-top"
          style={{marginBottom: '-80px'}}>
          <h1 className="uk-text-center uk-align-center">
            {title}
          </h1>
          <h3 className="uk-text-center uk-align-center uk-margin-remove-vertical">
            {text}
          </h3>
        </div>
      </div>
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
