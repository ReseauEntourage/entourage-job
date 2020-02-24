/* global UIkit */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CVEditPicture = ({ urlImg, onChange }) => {
  const [url, setUrl] = useState(urlImg);
  useEffect(() => {
    setUrl(urlImg);
  }, [urlImg]);
  return (
    <div
      className="uk-card uk-height-1-1 uk-background-cover"
      style={{ backgroundImage: `url(${url})`, minHeight: '300px' }}
    >
      <div className=" uk-position-center " data-uk-form-custom>
        <div
          className="uk-overlay uk-overlay-default uk-box-shadow-hover-small"
          style={{ cursor: 'pointer' }}
        >
          <label className="uk-text-uppercase" htmlFor="image-upload">
            <input
              id="image-upload"
              type="file"
              onChange={({ target }) => {
                onChange({ profileImage: target.files[0] });
                setUrl(URL.createObjectURL(target.files[0]));
              }}
            />
            Mettre à jour
          </label>
        </div>
      </div>
    </div>
  );
};
CVEditPicture.propTypes = {
  urlImg: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
CVEditPicture.defaultProps = {
  urlImg: '../../static/img/arthur-background.jpg',
};
export default CVEditPicture;
