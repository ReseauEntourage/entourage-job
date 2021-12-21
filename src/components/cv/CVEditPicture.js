/* global UIkit */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Resizer from 'react-image-file-resizer';
import { addPrefix } from 'src/utils';

const CVEditPicture = ({
  urlImg,
  onChange,
  disablePicture,
  imageUploading,
}) => {
  const [url, setUrl] = useState(urlImg);

  useEffect(() => {
    setUrl(urlImg);
  }, [urlImg]);

  const resizeFile = (file) => {
    return new Promise((resolve) => {
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
  };

  return (
    <div
      className="uk-card uk-card-default uk-height-1-1 uk-background-cover"
      style={{ backgroundImage: `url(${addPrefix(url)})`, minHeight: '300px' }}
    >
      {!disablePicture && (
        <div className=" uk-position-center ">
          <div
            className="uk-overlay uk-overlay-default uk-box-shadow-hover-small"
            style={{ cursor: 'pointer' }}
          >
            {imageUploading ? (
              <div>
                Chargement de l&apos;image&nbsp;
                <div
                  className="uk-margin-small-left"
                  data-uk-spinner="ratio: 0.6"
                />
              </div>
            ) : (
              <div data-uk-form-custom>
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
                        const profileImageObjectUrl =
                          URL.createObjectURL(image);
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
            )}
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
  imageUploading: PropTypes.bool,
};
CVEditPicture.defaultProps = {
  urlImg: '/static/img/arthur-background.jpg',
  disablePicture: false,
  imageUploading: false,
};
export default CVEditPicture;
