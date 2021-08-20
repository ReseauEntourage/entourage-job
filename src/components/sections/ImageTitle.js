import React from 'react';
import PropTypes from 'prop-types';
import { addPrefix } from 'src/utils';

const ImageTitle = ({ id, title, text, img }) => {
  return (
    <div
      id={id}
      className="uk-modal-body uk-background-muted uk-margin-remove uk-padding-remove"
    >
      <div
        style={{
          position: 'relative',
          minHeight: '220px',
          maxHeight: '300px',
          height: '50vw',
        }}
      >
        <div
          className="uk-background-cover uk-background-center uk-box-shadow-small"
          style={{
            backgroundImage: `url("${addPrefix(img)}")`,
            backgroundPosition: 'center 30%',
            position: 'absolute',
            right: 0,
            top: 0,
            left: 0,
            display: 'block',
            width: '100%',
            minHeight: '140%',
            maxHeight: '140%',
            height: '70vw',
          }}
        />
      </div>
      <div className="uk-flex uk-flex-column uk-flex-center uk-position-relative uk-width-1-2@m uk-align-center uk-background-default uk-padding uk-box-shadow-medium">
        <h1 className="uk-text-center uk-align-center uk-text-bold uk-margin-remove-vertical">
          {title}
        </h1>
        {text && (
          <h4 className="uk-text-center uk-align-center uk-margin-remove-bottom">
            {text}
          </h4>
        )}
      </div>
    </div>
  );
};

ImageTitle.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.element.isRequired,
  text: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  img: PropTypes.string.isRequired,
};

ImageTitle.defaultProps = {
  text: undefined,
};

export default ImageTitle;
