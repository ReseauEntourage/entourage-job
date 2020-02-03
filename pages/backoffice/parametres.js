import React, { useContext } from 'react';
import Router from 'next/router';
import LayoutBackOffice from '../../components/backoffice/LayoutBackOffice';
import { UserContext } from '../../components/store/UserProvider';
import { Section, GridNoSSR, IconNoSSR } from '../../components/utils';
import ParamCVVisible from '../../components/parameters/ParamCVVisible';
import HeaderBackoffice from '../../components/headers/HeaderBackoffice';

const Parametres = () => {
  const title = `Mes Paramètres`;
  const { isAuthentificated, user } = useContext(UserContext);
  if (!isAuthentificated) {
    // Router.push('/login');
    return null;
  }
  return (
    <LayoutBackOffice title={title}>
      <Section>
        <HeaderBackoffice
          title="Mes paramètres"
          description="Ici, tu peux gérer les données qui sont liées à ton compte sur LinkedOut. Tu peux aussi changer ton mail et ton mot de passe."
        />
        <ParamCVVisible />
        <div className="uk-width-1-2">
          <div className="uk-card uk-card-hover uk-card-default uk-card-body">
            <h3 className="uk-card-title">Informations personelles</h3>
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
        </div>
      </Section>
    </LayoutBackOffice>
  );
};

export default Parametres;
