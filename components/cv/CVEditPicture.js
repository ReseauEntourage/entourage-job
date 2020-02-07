/* global UIkit */
import React from 'react';
import PropTypes from 'prop-types';
import axios from '../../Axios';

const CVEditPicture = ({ urlImg, onChange }) => {
  return (
    <>
      <div
        className="uk-card uk-height-1-1 uk-background-cover uk-background-blend-multiply uk-background-secondary"
        style={{ backgroundImage: `url(${urlImg})`, minHeight: '300px' }}
      />
      <div className="js-upload" data-uk-form-custom>
        <input
          type="file"
          onChange={async ({ target }) => {
            const file = target.files[0];
            try {
              const { data } = await axios.post('/api/v1/cv/image', { file });
              // todo

              onChange({ urlImg: data.urlImg });
              UIkit.notification('Photo enregistrée', 'success');
            } catch (err) {
              UIkit.notification(
                "Erreur lors de l'enregistrement de la photo",
                'danger'
              );
            }
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
      {/* <span uk-icon="plus" /> */}
      {/* <span>Mettre à jour</span>
      <ModalGeneric id="modal-update-image">
        {(close) => (
        )}
      </ModalGeneric>
    </div> */}
    </>
  );
};
CVEditPicture.propTypes = {
  urlImg: PropTypes.string,
  onChange: PropTypes.func,
};
CVEditPicture.defaultProps = {
  urlImg: '../../static/img/arthur-background.jpg',
};
export default CVEditPicture;
