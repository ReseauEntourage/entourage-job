import React, { useContext } from 'react';
import dynamic from 'next/dynamic';
import { UserContext } from '../store/UserProvider';
import { IconNoSSR, SimpleLink, DropdownNoSSR } from '../utils';
import './Header.less';

export const HeaderUserDropdownNoSSR = dynamic(
  () => import('./HeaderUserDropdown'),
  {
    ssr: false,
  }
);

const HeaderUserDropdown = () => {
  const { user, logout } = useContext(UserContext);
  if (!user) {
    return null;
  }
  return (
    <>
      <a
        style={{
          fontWeight: 500,
          fontSize: '1rem',
          color: 'black',
          textTransform: 'none',
        }}
        id="untruc"
      >
        <img
          className="uk-border-circle"
          src="/static/img/arthur-background.jpg"
          width="40"
          alt="Menu"
          style={{ height: '40px' }}
        />
        <span className="uk-margin-small-left">Salut {user.firstName}</span>
        <IconNoSSR name="triangle-down" />
      </a>
      <DropdownNoSSR dividers={[2]}>
        <a href="#">Mon profil</a>
        <SimpleLink href="/backoffice/parametres">Paramètres</SimpleLink>
        <a href="#" onClick={logout}>
          Se déconnecter
        </a>
      </DropdownNoSSR>
    </>
  );
};

export default HeaderUserDropdown;
