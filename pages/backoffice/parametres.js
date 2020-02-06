/* global UIkit */
import React, { useContext, useState } from 'react';
import LayoutBackOffice from '../../components/backoffice/LayoutBackOffice';
import { UserContext } from '../../components/store/UserProvider';
import { Section, GridNoSSR, IconNoSSR } from '../../components/utils';
import ParamCVVisible from '../../components/parameters/ParamCVVisible';
import HeaderBackoffice from '../../components/headers/HeaderBackoffice';
import ModalEdit from '../../components/modals/ModalEdit';
import ButtonIcon from '../../components/utils/ButtonIcon';
import schemaPersonalData from '../../components/forms/schema/formPersonalData';
import Api from '../../Axios';
import FormWithValidation from '../../components/forms/FormWithValidation';
import schemaChangePassword from '../../components/forms/schema/formChangePassword';

const Parametres = () => {
  const title = `Mes Paramètres`;
  const { user, setUser } = useContext(UserContext);
  const Content = () => {
    if (!user) return null;
    console.log(user);

    return (
      <>
        <ParamCVVisible />

        <GridNoSSR childWidths={['1-2@m']}>
          <div className="uk-card uk-card-default uk-card-body">
            <GridNoSSR gap="small" between eachWidths={['expand', 'auto']}>
              <h3 className="uk-card-title">Informations personelles</h3>
              <ButtonIcon
                name="pencil"
                onClick={() => {
                  UIkit.modal(`#modal-personal-data`).show();
                }}
              />
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
          <div className="uk-card uk-card-default uk-card-body">
            <h3 className="uk-card-title">Changer de mot de passe</h3>
            <FormWithValidation
              submitText="Modifier"
              formSchema={schemaChangePassword}
              onSubmit={({ newPassword, oldPassword, confirmPassword }) => {
                if (
                  newPassword !== oldPassword &&
                  newPassword === confirmPassword
                ) {
                  Api.put('/api/v1/user/change-pwd', {
                    newPassword,
                    oldPassword,
                  })
                    .then(() => {
                      UIkit.notification(
                        'Nouveau mot de passe enregistré',
                        'success'
                      );
                    })
                    .catch((err) => {
                      console.error(err);
                      UIkit.notification(
                        "Problème lors de l'enregistrement du nouveau mot de passe",
                        'danger'
                      );
                    });
                } else {
                  UIkit.notification('Nouveau mot de passe erroné', 'warning');
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
                });
            }

            if (user.email === oldEmail && newEmail0 === newEmail1) {
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
                });
            }
          }}
        />
      </>
    );
  };
  return (
    <LayoutBackOffice title={title}>
      <Section>
        <HeaderBackoffice
          title="Mes paramètres"
          description="Ici, tu peux gérer les données qui sont liées à ton compte sur LinkedOut. Tu peux aussi changer ton mail et ton mot de passe."
        />
        <Content />
      </Section>
    </LayoutBackOffice>
  );
};

export default Parametres;
