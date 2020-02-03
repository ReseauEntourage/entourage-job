import React, { useContext } from 'react';
import { UserContext } from '../store/UserProvider';
import { IconNoSSR, SimpleLink } from '../utils';
import './Header.less';

const HeaderUserDropdown = () => {
  const { user, logout } = useContext(UserContext);
  if (!user) {
    return null;
  }
  return (
    <div
      id="headerUserDropdown"
      className="uk-inline"
      style={{ padding: '20px 15px', fontWeight: 500 }}
    >
      <button
        type="button"
        className="uk-button uk-button-text"
        style={{ textTransform: 'none' }}
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
      </button>
      <div uk-dropdown="mode: click">
        <ul className="uk-nav uk-dropdown-nav">
          <li>
            <a href="#">Mon profil</a>
          </li>
          <li>
            <SimpleLink href="/backoffice/parametres">Paramètres</SimpleLink>
          </li>
          <li className="uk-nav-divider" />
          <li>
            <a href="#" onClick={logout}>
              Se déconnecter
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HeaderUserDropdown;
