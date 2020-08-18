/* global UIkit */
import React, {useContext, useState, useEffect, useRef} from 'react';
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
import {USER_ROLES} from "../../constants";
import {useResetForm} from "../../hooks";
import UserInformationCard from "../../components/cards/UserInformationCard";
import {mutateFormSchema} from "../../utils";

const Parametres = () => {
  const { user } = useContext(UserContext);
  const [userData, setUserData] = useState(false);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [form, resetForm] = useResetForm();

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

  let mutatedSchema = schemaPersonalData;

  if(userData && userData.role !== USER_ROLES.ADMIN) {
    mutatedSchema = mutateFormSchema(schemaPersonalData, [
      {
        fieldId: 'firstName',
        props: [
          {
            propName: 'disabled',
            value: true
          },
          {
            propName: 'hidden',
            value: true
          }
        ]
      },
      {
        fieldId: 'lastName',
        props: [
          {
            propName: 'disabled',
            value: true
          },
          {
            propName: 'hidden',
            value: true
          }
        ]
      },
      {
        fieldId: 'gender',
        props: [
          {
            propName: 'disabled',
            value: true
          },
          {
            propName: 'hidden',
            value: true
          }
        ]
      },
    ]);
  }

  if (!user) return null;

  return (
    <LayoutBackOffice title="Mes Paramètres">
      <Section>
        <HeaderBackoffice
          title="Mes paramètres"
          description="Ici, vous pouvez gérer les données qui sont liées à votre compte sur LinkedOut. Vous pouvez aussi changer votre mail et votre mot de passe."
        />
        <GridNoSSR childWidths={['1-2@m']}>
          <GridNoSSR childWidths={['1-1']}>
            {/* Preferences du CV */}
            {userData.role === USER_ROLES.CANDIDAT && (
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
                  title="Masquer mon CV"
                  modalTitle="Changer la visibilité du CV en ligne ?"
                  modalDescription={
                    <>
                      En masquant votre CV de LinkedOut, il ne sera plus visible
                      par les utilisateurs du site.
                      <br />
                      Vous pourrez le remettre en ligne à tout moment.
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
                <h3 className="uk-card-title">Informations personnelles</h3>
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
                    <IconNoSSR name="user" style={{width: 20}} />
                    <span>{`${userData.firstName} ${userData.lastName}`}</span>
                  </GridNoSSR>
                  <GridNoSSR row gap="small">
                    <IconNoSSR name="gender" style={{width: 20}} />
                    <span>{`${userData.gender === 0 ? 'Homme' : 'Femme'}`}</span>
                  </GridNoSSR>
                  <GridNoSSR row gap="small">
                    <IconNoSSR name="mail" style={{width: 20}} />
                    <span>{userData.email}</span>
                  </GridNoSSR>
                  <GridNoSSR row gap="small">
                    <IconNoSSR name="phone" style={{width: 20}} />
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
            {(userData.role === USER_ROLES.CANDIDAT || userData.role === USER_ROLES.COACH) && (
              <UserInformationCard
                user={userData}
                onChange={(data) => {
                  setUserData(data);
                }}
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
              ref={form}
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
                      resetForm();
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
        <div>
          <ModalEdit
            submitText="Envoyer"
            id="modal-personal-data"
            title="Édition - Informations personelles"
            defaultValues={{
              firstName: userData.firstName,
              lastName: userData.lastName,
              gender: userData && userData.gender.toString(),
              phone: userData.phone
            }}
            formSchema={mutatedSchema}
            onSubmit={({ firstName, lastName, gender, phone, oldEmail, newEmail0, newEmail1 }, closeModal, setError) => {
              const updateUser = (newUserData) => {
                setLoadingPersonal(true);
                Api.put(`/api/v1/user/${userData.id}`, newUserData)
                  .then(() => {
                    closeModal();
                    setUserData({ ...userData, ...newUserData });
                    UIkit.notification(
                      'Vos informations personnelles ont bien été mises à jour',
                      'success'
                    );
                  })
                  .catch((err) => {
                    console.error(err);
                    UIkit.notification(
                      "Une erreur c'est produite lors de la mise à jour de vos informations personnelles",
                      'danger'
                    );
                  })
                  .finally(() => setLoadingPersonal(false));
              };

              let newUserData = {};
              if(userData.role === USER_ROLES.ADMIN) {
                newUserData = {firstName, lastName, gender};
                if (phone !== userData.phone) {
                  newUserData.phone = phone;
                }
                if (userData.email === oldEmail && newEmail0 === newEmail1) {
                  newUserData.email = newEmail0.toLowerCase();
                }
                updateUser(newUserData);
              }
              else {
                if (phone !== userData.phone) {
                  newUserData.phone = phone;
                }
                if(oldEmail || newEmail0 || newEmail1) {
                  if (userData.email !== oldEmail.toLowerCase()) {
                    setError("L'ancienne adresse email n'est pas valide");
                  }
                  else if(newEmail0.length === 0 || newEmail0 !== newEmail1) {
                    setError("Les deux adresses email ne sont pas indentiques");
                  }
                  else {
                    newUserData.email = newEmail0.toLowerCase();
                    updateUser(newUserData);
                    setError("");
                  }
                }
                else {
                  updateUser(newUserData);
                }
              }
            }}
          />
        </div>
      </Section>
    </LayoutBackOffice>
  );
};

export default Parametres;
