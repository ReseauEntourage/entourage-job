/* global UIkit */
import React, { useContext, useState } from 'react';
import LayoutBackOffice from '../../components/backoffice/LayoutBackOffice';
import { UserContext } from '../../components/store/UserProvider';
import { Section, GridNoSSR, IconNoSSR } from '../../components/utils';
import HeaderBackoffice from '../../components/headers/HeaderBackoffice';
import ModalEdit from '../../components/modals/ModalEdit';
import ButtonIcon from '../../components/utils/ButtonIcon';
import Api from '../../Axios';
import FormWithValidation from '../../components/forms/FormWithValidation';
import schemaPersonalData from '../../components/forms/schema/formPersonalData.json';
import schemaChangePassword from '../../components/forms/schema/formChangePassword.json';
import ToggleWithConfirmationModal from '../../components/backoffice/ToggleWithConfirmationModal';

const Parametres = () => {
  const { user, setUser } = useContext(UserContext);

  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  if (!user) return null;

  return (
    <LayoutBackOffice title="Mes Paramètres">
      <Section>
        <HeaderBackoffice
          title="Mes paramètres"
          description="Ici, tu peux gérer les données qui sont liées à ton compte sur LinkedOut. Tu peux aussi changer ton mail et ton mot de passe."
        />
        <GridNoSSR childWidths={['1-2@m']} match>
          <GridNoSSR childWidths={['1-1']}>
            {/* Preferences du CV */}
            {user.role === 'Candidat' && (
              <div className="uk-card uk-card-default uk-card-body">
                <h3 className="uk-card-title">Préférences du CV</h3>
                <ToggleWithConfirmationModal
                  id="hidden"
                  title="Je masque mon CV"
                  modalTitle="Changer la visibilité du CV en ligne ?"
                  modalDescription={
                    <>
                      En masquant ton CV de LinkedOut, il ne sera plus visible
                      par les utilisateurs du site.
                      <br />
                      Tu pourras le remettre en ligne à tout moment.
                    </>
                  }
                  modalConfirmation="Oui, masquer mon CV"
                  defaultValue={user.hidden}
                  onToggle={(hidden) =>
                    Api.put(`/api/v1/user/${user.id}`, {
                      hidden,
                    })
                      .then(() =>
                        UIkit.notification(
                          hidden
                            ? 'Votre CV est désormais masqué'
                            : 'Votre CV est désormais visible',
                          'success'
                        )
                      )
                      .catch(() =>
                        UIkit.notification(
                          'Une erreur est survenue lors du masquage de votre profil',
                          'danger'
                        )
                      )
                  }
                />
                <ToggleWithConfirmationModal
                  id="employed"
                  title="J'ai retrouvé un emploi"
                  modalTitle="Vous avez retrouvé un emploi ?"
                  modalConfirmation="Oui, j'ai retrouvé un emploi"
                  defaultValue={user.employed}
                  onToggle={(employed) =>
                    Api.put(`/api/v1/user/${user.id}`, {
                      employed,
                    })
                      .then(() =>
                        UIkit.notification(
                          'Votre profil a été mis à jour !',
                          'success'
                        )
                      )
                      .catch(() =>
                        UIkit.notification('Une erreur est survenue', 'danger')
                      )
                  }
                />
              </div>
            )}
            {/* Informations personnelles */}
            <div className="uk-card uk-card-default uk-card-body">
              <GridNoSSR gap="small" between eachWidths={['expand', 'auto']}>
                <h3 className="uk-card-title">Informations personelles</h3>
                {loadingPersonal ? (
                  <div data-uk-spinner="ratio: .8" />
                ) : (
                  <ButtonIcon
                    name="pencil"
                    onClick={() => UIkit.modal(`#modal-personal-data`).show()}
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
          </GridNoSSR>

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
