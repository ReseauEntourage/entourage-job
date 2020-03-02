/* global UIkit */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR, CloseButtonNoSSR, Button } from '../utils';
import Api from '../../Axios';
import ModalGeneric from '../modals/ModalGeneric';
import HeaderModal from '../modals/HeaderModal';

// Profil a retrouvé un emploi
const FoundJobUser = ({ userId }) => {
  const [found, setFound] = useState(false);

  const foundJob = (employed) =>
    Api.put(`/api/v1/user/${userId}`, {
      employed,
    })
      .then(() => {
        setFound(employed);
        UIkit.notification('Votre profil a été mis à jour !', 'success');
      })
      .catch((err) => {
        console.error(err);
        UIkit.notification('Une erreur est survenue', 'danger');
      });
  return (
    <div className="uk-padding uk-padding-remove-left">
      <p className="uk-inline ">
        J&apos;ai retrouvé un emploi :
        <span className="uk-form-controls uk-padding">
          <label className="ent-toggle" htmlFor="ent-toggle-employed">
            <input
              id="ent-toggle-employed"
              type="checkbox"
              checked={found}
              onChange={() => {
                if (found) {
                  foundJob(false);
                } else {
                  UIkit.modal('#modal-confirm-employed').show();
                }
              }}
            />
            <span className="ent-slider round" />
          </label>
        </span>
      </p>
      <ModalGeneric id="modal-confirm-employed">
        {(closeModal) => (
          <>
            <CloseButtonNoSSR className="uk-modal-close-default" />
            <HeaderModal>Vous avez retrouvé un emploi ?</HeaderModal>
            <p
              className="uk-text-lead"
              style={{
                lineHeight: '1.2',
                fontSize: '1.2rem',
                fontWeight: '500',
              }}
            >
              {/* En masquant ton CV de LinkedOut, il ne sera plus visible par les
              utilisateurs du site.
              <br />
              Tu pourras le remettre en ligne à tout moment. */}
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
                    foundJob(true);
                    closeModal();
                  }}
                >
                  Oui, j&apos;ai retrouvé un emploi
                </Button>,
              ]}
            />
          </>
        )}
      </ModalGeneric>
    </div>
  );
};
FoundJobUser.propTypes = {
  userId: PropTypes.string.isRequired,
};
export default FoundJobUser;
