import React, { useContext } from 'react';
import Router from 'next/router';
import LayoutBackOffice from '../../components/backoffice/LayoutBackOffice';
import { UserContext } from '../../components/store/UserProvider';
import { Section } from '../../components/utils';
import ParamCVVisible from '../../components/parameters/ParamCVVisible';

const Parametres = () => {
  const title = `Mes Paramètres`;
  const userContext = useContext(UserContext);
  if (!userContext.isAuthentificated) {
    // Router.push('/login');
    return null;
  }
  return (
    <LayoutBackOffice title={title}>
      <Section>
        <h2 className="uk-text-bold">Mes paramètres</h2>
        <hr
          className="uk-margin-medium-top"
          style={{ borderTop: '1px solid black' }}
        />
        <ParamCVVisible />
      </Section>
    </LayoutBackOffice>
  );
};

export default Parametres;
