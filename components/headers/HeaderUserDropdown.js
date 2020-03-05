/* global UIkit */
import React, { useContext } from 'react';
import { UserContext } from '../store/UserProvider';
import { IconNoSSR, SimpleLink } from '../utils';
import Dropdown from '../utils/Dropdown';
import './Header.less';

const HeaderUserDropdown = () => {
  const { user, logout } = useContext(UserContext);
  if (!user) {
    return null;
  }
  return (
    <>
      <a
        id="nav-profile"
        style={{
          fontWeight: 500,
          fontSize: '1rem',
          color: 'black',
          textTransform: 'none',
        }}
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
      <Dropdown
        dividers={[2]}
        id="dropdown-nav-profile"
        boundaryId="nav-profile"
      >
        <a href="#">Mon profil</a>
        <SimpleLink href="/backoffice/parametres">Paramètres</SimpleLink>
        <a href="#" onClick={logout}>
          Se déconnecter
        </a>
      </Dropdown>
    </>
  );
};

export default HeaderUserDropdown;
