/* global UIkit */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Resizer from 'react-image-file-resizer';
import { addPrefix } from '../../utils';

const CVEditPicture = ({ urlImg, onChange, disablePicture }) => {
  const [url, setUrl] = useState(urlImg);
  useEffect(() => {
    setUrl(urlImg);
  }, [urlImg]);

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        2000,
        1500,
        'JPEG',
        75,
        0,
        (uri) => {
          resolve(uri);
        },
        'blob'
      );
    });

  return (
    <div
      className="uk-card uk-card-default uk-height-1-1 uk-background-cover"
      style={{ backgroundImage: `url(${addPrefix(url)})`, minHeight: '300px' }}
    >
      {!disablePicture && (
        <div className=" uk-position-center " data-uk-form-custom>
          <div
            className="uk-overlay uk-overlay-default uk-box-shadow-hover-small"
            style={{ cursor: 'pointer' }}
          >
            <label className="uk-text-uppercase" htmlFor="image-upload">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={async ({ target }) => {
                  const file = target.files[0];

                  if (file) {
                    if (!file.type.includes('image/')) {
                      UIkit.notification(
                        'Le fichier doit être une image',
                        'danger'
                      );
                    }

                    const image = await resizeFile(file);
                    const profileImageObjectUrl = URL.createObjectURL(image);
                    onChange({
                      profileImage: image,
                      profileImageObjectUrl,
                    });
                    setUrl(profileImageObjectUrl);
                  }
                }}
              />
              Mettre à jour
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
CVEditPicture.propTypes = {
  urlImg: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disablePicture: PropTypes.bool,
};
CVEditPicture.defaultProps = {
  urlImg: '../../static/img/arthur-background.jpg',
  disablePicture: false,
};
export default CVEditPicture;
