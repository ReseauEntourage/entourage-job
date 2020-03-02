/* global UIkit */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR, CloseButtonNoSSR, Button } from '../utils';
import Api from '../../Axios';
import ModalGeneric from '../modals/ModalGeneric';
import HeaderModal from '../modals/HeaderModal';

// Masquer profil
const HideUser = ({ userId }) => {
  const [hide, setHide] = useState(false);
  const hideCV = (hidden) =>
    Api.put(`/api/v1/user/${userId}`, {
      hidden,
    })
      .then(() => {
        setHide(hidden);
        UIkit.notification(
          hidden
            ? 'Votre CV est désormais masqué'
            : 'Votre CV est désormais visible',
          'success'
        );
      })
      .catch((err) => {
        console.error(err);
        UIkit.notification(
          'Une erreur est survenue lors du masquage de votre profil',
          'danger'
        );
      });
  return (
    <div className="uk-padding uk-padding-remove-left">
      <p className="uk-inline ">
        Masquer mon CV du site LinkedOut :
        <span className="uk-form-controls uk-padding">
          <label className="ent-toggle" htmlFor="ent-toggle-hide">
            <input
              id="ent-toggle-hide"
              type="checkbox"
              checked={hide}
              onChange={() => {
                if (hide) {
                  hideCV(false);
                } else {
                  UIkit.modal('#modal-confirm-hide').show();
                }
              }}
            />
            <span className="ent-slider round" />
          </label>
        </span>
      </p>
      <ModalGeneric id="modal-confirm-hide">
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
HideUser.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default HideUser;
