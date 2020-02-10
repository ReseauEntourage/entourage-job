/* global UIkit */
import React from 'react';
import PropTypes from 'prop-types';
import axios from '../../Axios';

const CVEditPicture = ({ urlImg, onChange }) => {
  return (
    <div
      className="uk-card uk-height-1-1 uk-background-cover "
      style={{ backgroundImage: `url(${urlImg})`, minHeight: '300px' }}
    >
      <div className="uk-overlay-default uk-position-cover" data-uk-form-custom>
        <div className="uk-position-center">
          <input
            type="file"
            onChange={({ target }) => {
              const file = target.files[0];
              axios
                .post('/api/v1/cv/image', { file })
                .then(({ data }) => {
                  onChange({ urlImg: data.urlImg });
                  UIkit.notification('Photo enregistrée', 'success');
                })
                .catch((err) => {
                  console.error(err);
                  UIkit.notification(
                    "Erreur lors de l'enregistrement de la photo",
                    'danger'
                  );
                });
            }}
          />
          <button
            className="uk-button uk-button-default"
            type="button"
            tabIndex="-1"
            on
          >
            Select
          </button>
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
