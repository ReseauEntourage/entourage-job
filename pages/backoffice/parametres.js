/* global UIkit */
import React, { useContext, useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import LayoutBackOffice from '../../components/backoffice/LayoutBackOffice';
import { UserContext } from '../../components/store/UserProvider';
import {
  Section,
  GridNoSSR,
  IconNoSSR,
  SimpleLink,
  Card,
} from '../../components/utils';
import HeaderBackoffice from '../../components/headers/HeaderBackoffice';
import ModalEdit from '../../components/modals/ModalEdit';
import ButtonIcon from '../../components/utils/ButtonIcon';
import Api from '../../Axios';
import FormWithValidation from '../../components/forms/FormWithValidation';
import schemaPersonalData from '../../components/forms/schema/formPersonalData.json';
import schemaChangePassword from '../../components/forms/schema/formChangePassword.json';
import ToggleWithConfirmationModal from '../../components/backoffice/ToggleWithConfirmationModal';

// userId du candidat ou coach lié
const UserInformationCard = ({ title, user }) => {
  // données du candidat ou coach lié
  const [linkedUser, setLinkedUser] = useState();
  const [userCandidat, setUserCandidat] = useState();

  useEffect(() => {
    if (user) {
      if (user.role === 'Coach' && user.coach) {
        setLinkedUser(user.coach.candidat);
        setUserCandidat(user.coach);
      }
      if (user.role === 'Candidat' && user.candidat) {
        setLinkedUser(user.candidat.coach);
        setUserCandidat(user.candidat);
      }
    }
  }, [user]);

  // si membre lié
  if (linkedUser) {
    return (
      <Card style="secondary" title={title}>
        <GridNoSSR column gap="small">
          <GridNoSSR row gap="small">
            <IconNoSSR name="user" />
            <span>{`${linkedUser.firstName} ${linkedUser.lastName}`}</span>
          </GridNoSSR>

          <SimpleLink
            href={`mailto:${linkedUser.email}`}
            className="uk-link-muted"
            isExternal
          >
            <GridNoSSR row gap="small">
              <IconNoSSR name="mail" />
              <span>{linkedUser.email}</span>
            </GridNoSSR>
          </SimpleLink>
          {linkedUser.phone ? (
            <SimpleLink
              href={`tel:${linkedUser.phone}`}
              className="uk-link-muted"
              isExternal
            >
              <GridNoSSR row gap="small">
                <IconNoSSR name="phone" />
                <span>{linkedUser.phone}</span>
              </GridNoSSR>
            </SimpleLink>
          ) : (
            <GridNoSSR row gap="small">
              <IconNoSSR name="phone" />
              <span className="uk-text-italic">
                Numéro de téléphone non renseigné
              </span>
            </GridNoSSR>
          )}
          {user.role === 'Coach' && (
            <SimpleLink
              className="uk-link-muted"
              target="_blank"
              href={`/cv/${userCandidat.url}`}
            >
              <GridNoSSR row gap="small">
                <IconNoSSR name="link" />
                <span className="uk-text-italic">{userCandidat.url}</span>
              </GridNoSSR>
            </SimpleLink>
          )}
          {user.role === 'Coach' && (
            <GridNoSSR row gap="small">
              <IconNoSSR name="cog" />
              <span className="uk-text-italic">
                {userCandidat.hidden ? 'CV caché' : 'CV visible'}
              </span>
            </GridNoSSR>
          )}
          {user.role === 'Coach' && (
            <GridNoSSR row gap="small">
              <IconNoSSR name="cog" />
              <span className="uk-text-italic">
                {userCandidat.employed
                  ? 'A retrouvé un emploi'
                  : "N'a pas retrouvé d'emploi"}
              </span>
            </GridNoSSR>
          )}
        </GridNoSSR>
      </Card>
    );
  }
  // si pas de membre lié
  return (
    <Card style="secondary" title={title}>
      <span className="uk-text-italic">Aucun membre lié</span>
    </Card>
  );
};
UserInformationCard.propTypes = {
  title: PropTypes.string.isRequired,
  user: PropTypes.shape.isRequired,
};

const Parametres = () => {
  const { user } = useContext(UserContext);
  const [userData, setUserData] = useState(false);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setLoadingPersonal(true);
      Api.get(`/api/v1/user/${user.id}`)
        .then(({ data }) => {
          setUserData(data);
        })
        .finally(() => setLoadingPersonal(false));
    }
  }, [user]);

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
            {userData.role === 'Candidat' && (
              <Card title="Préférences du CV">
                <ToggleWithConfirmationModal
                  id="employed"
                  title="J'ai retrouvé un emploi"
                  modalTitle="Vous avez retrouvé un emploi ?"
                  modalConfirmation="Oui, j'ai retrouvé un emploi"
                  defaultValue={userData.candidat.employed}
                  onToggle={(employed) =>
                    Api.put(`/api/v1/user/candidat/${userData.id}`, {
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
                  defaultValue={userData.candidat.hidden}
                  onToggle={(hidden) =>
                    Api.put(`/api/v1/user/candidat/${userData.id}`, {
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
              </Card>
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
              {userData ? (
                <GridNoSSR column gap="small">
                  <GridNoSSR row gap="small">
                    <IconNoSSR name="user" />
                    <span>{`${userData.firstName} ${userData.lastName}`}</span>
                  </GridNoSSR>
                  <GridNoSSR row gap="small">
                    <IconNoSSR name="mail" />
                    <span>{userData.email}</span>
                  </GridNoSSR>
                  <GridNoSSR row gap="small">
                    <IconNoSSR name="phone" />
                    {userData.phone ? (
                      <span>{userData.phone}</span>
                    ) : (
                      <span className="uk-text-italic">
                        Numéro de téléphone non renseigné
                      </span>
                    )}
                  </GridNoSSR>
                </GridNoSSR>
              ) : (
                undefined
              )}
            </div>

            {(userData.role === 'Candidat' || userData.role === 'Coach') && (
              <UserInformationCard
                title={`Coordonnées de ${
                  userData.role === 'Coach'
                    ? ' mon candidat'
                    : ' mon bénévole coach'
                }`}
                user={userData}
              />
            )}
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
          defaultValues={{ phone: userData.phone }}
          formSchema={schemaPersonalData}
          onSubmit={({ phone, oldEmail, newEmail0, newEmail1 }) => {
            if (phone !== userData.phone) {
              setLoadingPersonal(true);
              Api.put(`/api/v1/user/${userData.id}`, {
                phone,
              })
                .then(() => {
                  setUserData({ ...userData, phone });
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

            if (userData.email === oldEmail && newEmail0 === newEmail1) {
              setLoadingPersonal(true);
              Api.put(`/api/v1/user/${userData.id}`, {
                email: newEmail0,
              })
                .then(() => {
                  setUserData({ ...userData, email: newEmail0 });
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
