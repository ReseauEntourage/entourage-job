/* global UIkit */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Api from '../../Axios';
import { CloseButtonNoSSR, GridNoSSR, Button } from '../utils';
import '../../static/css/Toggle.less';
import ModalGeneric from '../modals/ModalGeneric';
import HeaderModal from '../modals/HeaderModal';

const ParamCVVisible = () => {
  const [cv, setCV] = useState(null);
  const [error, setError] = useState(null);

  const hideCV = async (hiden) => {
    try {
      const { data } = await Api.put(
        `${process.env.SERVER_URL}/api/v1/cv/visibility`,
        {
          ...cv,
          visibility: !hiden,
        }
      );
      setCV(data);
    } catch (err) {
      console.error(err);
      setError('Une erreur est survenue');
    }
  };

  useEffect(() => {
    Api.get(`${process.env.SERVER_URL}/api/v1/cv/visibility`)
      .then(({ data }) => setCV(data))
      .catch(console.error);
  }, []);

  return (
    <div className="uk-padding uk-padding-remove-left">
      {cv ? (
        <p className="uk-inline ">
          Masquer mon CV du site LinkedOut :
          <span className="uk-form-controls uk-padding">
            <label className="ent-toggle" htmlFor="ent-toggle-visibility">
              <input
                id="ent-toggle-visibility"
                type="checkbox"
                checked={cv.visibility}
                onChange={() => {
                  if (cv.visibility) {
                    UIkit.modal('#modal-confirm-visibility').show();
                  } else {
                    hideCV(false);
                  }
                }}
              />
              <span className="ent-slider round" />
            </label>
          </span>
          {error && <span className="uk-text-danger">{error}</span>}
        </p>
      ) : (
        <p>Vous n&rsquo;etes lié à aucun CV</p>
      )}
      <ModalGeneric id="modal-confirm-visibility">
        {(closeModal) => (
          <>
            <CloseButtonNoSSR className="uk-modal-close-default" />
            <HeaderModal>Changer la visibilité du CV en ligne ?</HeaderModal>
            <p
              className="uk-text-lead"
              style={{
                lineHeight: '1.2',
                fontSize: '1.2rem',
                fontWeight: '500',
              }}
            >
              En masquant ton CV de LinkedOut, il ne sera plus visible par les
              utilisateurs du site.
              <br />
              Tu pourras le remettre en ligne à tout moment.
            </p>
            <GridNoSSR
              className="uk-grid-small uk-flex-center uk-margin-large-top"
              items={[
                <Button style="default" onClick={closeModal}>
                  Annuler
                </Button>,
                <Button
                  style="primary"
                  onClick={() => {
                    hideCV(true);
                    closeModal();
                  }}
                >
                  Oui, masquer mon CV
                </Button>,
              ]}
            />
          </>
        )}
      </ModalGeneric>
    </div>
  );
};

ParamCVVisible.defaultProps = {
  cv: null,
};
ParamCVVisible.propTypes = {
  cv: PropTypes.shape({
    visibility: PropTypes.bool,
  }),
};
export default ParamCVVisible;
