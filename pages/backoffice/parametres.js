/* global UIkit */
import React, { useContext, useState } from 'react';
import LayoutBackOffice from '../../components/backoffice/LayoutBackOffice';
import { UserContext } from '../../components/store/UserProvider';
import {
  Section,
  GridNoSSR,
  IconNoSSR,
  CloseButtonNoSSR,
  Button,
} from '../../components/utils';
import HeaderBackoffice from '../../components/headers/HeaderBackoffice';
import ModalEdit from '../../components/modals/ModalEdit';
import ButtonIcon from '../../components/utils/ButtonIcon';
import Api from '../../Axios';
import FormWithValidation from '../../components/forms/FormWithValidation';
import schemaPersonalData from '../../components/forms/schema/formPersonalData';
import schemaChangePassword from '../../components/forms/schema/formChangePassword';
import ModalGeneric from '../../components/modals/ModalGeneric';
import HeaderModal from '../../components/modals/HeaderModal';

const Parametres = () => {
  const { user, setUser } = useContext(UserContext);

  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const hideCV = async (hidden) => {
    Api.put(`/api/v1/user/${user.id}`, {
      hidden,
    })
      .then(() => {
        setUser({ ...user, hidden });

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
  };

  if (!user) return null;

  return (
    <LayoutBackOffice title="Mes Paramètres">
      <Section>
        <HeaderBackoffice
          title="Mes paramètres"
          description="Ici, tu peux gérer les données qui sont liées à ton compte sur LinkedOut. Tu peux aussi changer ton mail et ton mot de passe."
        />

        {/* Masquer profil */}
        <div className="uk-padding uk-padding-remove-left">
          <p className="uk-inline ">
            Masquer mon CV du site LinkedOut :
            <span className="uk-form-controls uk-padding">
              <label className="ent-toggle" htmlFor="ent-toggle-hide">
                <input
                  id="ent-toggle-hide"
                  type="checkbox"
                  checked={user.hidden}
                  onChange={() => {
                    if (user.hidden) {
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
                <HeaderModal>
                  Changer la visibilité du CV en ligne ?
                </HeaderModal>
                <p
                  className="uk-text-lead"
                  style={{
                    lineHeight: '1.2',
                    fontSize: '1.2rem',
                    fontWeight: '500',
                  }}
                >
                  En masquant ton CV de LinkedOut, il ne sera plus visible par
                  les utilisateurs du site.
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

        <GridNoSSR childWidths={['1-2@m']}>
          {/* Informations personnelles */}
          <div className="uk-card uk-card-default uk-card-body">
            <GridNoSSR gap="small" between eachWidths={['expand', 'auto']}>
              <h3 className="uk-card-title">Informations personelles</h3>
              {loadingPersonal ? (
                <div data-uk-spinner="ratio: .8" />
              ) : (
                <ButtonIcon
                  name="pencil"
                  onClick={() => {
                    UIkit.modal(`#modal-personal-data`).show();
                  }}
                />
              )}
            </GridNoSSR>

            <GridNoSSR column gap="small">
              <GridNoSSR row gap="small">
                <IconNoSSR name="user" />
                <span>{`${user.firstName} ${user.lastName}`}</span>
              </GridNoSSR>
              <GridNoSSR row gap="small">
                <IconNoSSR name="mail" />
                <span>{user.email}</span>
              </GridNoSSR>
              <GridNoSSR row gap="small">
                <IconNoSSR name="phone" />
                {user.phone ? (
                  <span>{user.phone}</span>
                ) : (
                  <span className="uk-text-italic">
                    Numéro de téléphone non renseigné
                  </span>
                )}
              </GridNoSSR>
            </GridNoSSR>
          </div>

          {/* Changement de mot de passe */}
          <div className="uk-card uk-card-default uk-card-body">
            <GridNoSSR gap="small" between eachWidths={['expand', 'auto']}>
              <h3 className="uk-card-title">Changer de mot de passe</h3>
              {loadingPassword ? <div data-uk-spinner="ratio: .8" /> : <></>}
            </GridNoSSR>
            <FormWithValidation
              submitText="Modifier"
              formSchema={schemaChangePassword}
              onSubmit={(
                { newPassword, oldPassword, confirmPassword },
                setError
              ) => {
                if (
                  newPassword !== oldPassword &&
                  newPassword === confirmPassword
                ) {
                  setLoadingPassword(true);
                  Api.put('/api/v1/user/change-pwd', {
                    newPassword,
                    oldPassword,
                  })
                    .then(() => {
                      UIkit.notification(
                        'Nouveau mot de passe enregistré',
                        'success'
                      );
                      setLoadingPassword(false); // lorsque utilisation de finaly => erreur de node/child
                    })
                    .catch((err) => {
                      console.error(err);
                      setError(
                        "Problème lors de l'enregistrement du nouveau mot de passe"
                      );
                      setLoadingPassword(false);
                    });
                } else {
                  setError('Nouveau mot de passe erroné');
                }
              }}
            />
          </div>
        </GridNoSSR>
        <ModalEdit
          submitText="Envoyer"
          id="modal-personal-data"
          title="Édition - Informations personelles"
          defaultValues={['', '', '', '', user.phone]}
          formSchema={schemaPersonalData}
          onSubmit={({ phone, oldEmail, newEmail0, newEmail1 }) => {
            const u = user;
            if (phone !== u.phone) {
              setLoadingPersonal(true);
              Api.put(`/api/v1/user/${user.id}`, {
                phone,
              })
                .then(() => {
                  setUser({ ...user, phone });
                  UIkit.notification(
                    'Votre numéro de téléphone a bien été mis à jour',
                    'success'
                  );
                })
                .catch((err) => {
                  console.error(err);
                  UIkit.notification(
                    "Une erreur c'est produite lors de la mise à jour de votre email",
                    'danger'
                  );
                })
                .finally(() => setLoadingPersonal(false));
            }

            if (user.email === oldEmail && newEmail0 === newEmail1) {
              setLoadingPersonal(true);
              Api.put(`/api/v1/user/${user.id}`, {
                email: newEmail0,
              })
                .then(() => {
                  setUser({ ...user, email: newEmail0 });
                  UIkit.notification(
                    'Votre email a bien été mis à jour',
                    'success'
                  );
                })
                .catch((err) => {
                  console.error(err);
                  UIkit.notification(
                    "Une erreur c'est produite lors de la mise à jour de votre email",
                    'danger'
                  );
                })
                .finally(() => setLoadingPersonal(false));
            }
          }}
        />
      </Section>
    </LayoutBackOffice>
  );
};

export default Parametres;
