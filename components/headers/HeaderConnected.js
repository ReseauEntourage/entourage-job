import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import {
  NavbarNoSSR,
  HamburgerNoSSR,
  NavbarLogo,
  IconNoSSR,
  OffcanvasNoSSR,
  SimpleLink,
} from '../utils';
import './Header.less';
import HeaderUserDropdown from './HeaderUserDropdown';
import { UserContext } from '../store/UserProvider';

const LINKS_CONNECTED = {
  admin: [
    { href: '/backoffice/admin/membres', name: 'Les membres', icon: 'users' },
    {
      href: '/backoffice/admin/offres',
      name: 'Les opportunités',
      icon: 'list',
    },
  ],
  member: [
    {
      href: '/backoffice/candidat/offres',
      name: 'Mes offres',
      icon: 'list',
    },
    { href: '/backoffice/candidat/cv', name: 'Mon CV', icon: 'user' },
    { href: '/backoffice/trace', name: 'Mon Suivi', icon: 'list' },
  ],
};

const HeaderConnected = ({ isHome }) => {
  const { user, logout } = useContext(UserContext);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') {
        setLinks(LINKS_CONNECTED.admin);
      }
      if (user.role === 'Candidat' || user.role === 'Coach') {
        setLinks(LINKS_CONNECTED.member);
      }
    }
  }, [user]);

  if (!user) return null;

  return (
    <header>
      <NavbarNoSSR
        className={`uk-background-default uk-navbar-transparent ${
          isHome ? 'ent-home' : 'ent-header-shadow'
        }`}
        left={
          <>
            <NavbarLogo
              href="/"
              src="/static/img/linkedout_by_entourage.png"
              alt="Linkedout"
            />
            <ul
              className="uk-navbar-nav"
              style={{ borderLeft: '1px solid lightgray' }}
            >
              {links.map((link, index) => (
                <li key={index} style={{ borderRight: '1px solid lightgray' }}>
                  <Link href={link.href}>
                    <a
                      className="uk-visible@m"
                      style={{
                        fontWeight: 500,
                        fontSize: '1rem',
                        color: 'black',
                        textTransform: 'none',
                      }}
                    >
                      <span className="uk-margin-small-right">
                        <IconNoSSR name={link.icon} />
                      </span>
                      {link.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        }
        right={
          <ul className="uk-navbar-nav">
            <li
              className="uk-visible@m"
              style={{ borderLeft: '1px solid lightgray' }}
            >
              <HeaderUserDropdown />
            </li>
            <li style={{ borderLeft: '1px solid lightgray' }}>
              <a
                className="uk-visible@m"
                style={{
                  fontWeight: 500,
                  fontSize: '1rem',
                  color: 'black',
                  textTransform: 'none',
                }}
              >
                <span className="uk-margin-small-left uk-margin-small-right">
                  <IconNoSSR name="bell" />
                </span>
              </a>
            </li>
            <HamburgerNoSSR href="#offcanvas" hidden="m" />
          </ul>
        }
      />
      <OffcanvasNoSSR id="offcanvas">
        <ul className="uk-nav uk-nav-default">
          <li>
            <SimpleLink href="/">
              <span
                className="uk-margin-small-right"
                data-uk-icon="icon: home"
              />
              Accueil
            </SimpleLink>
          </li>
          {links
            .filter(({ href }) => href !== '#')
            .map(({ href, icon, name }, index) => (
              <li key={index}>
                <SimpleLink href={href}>
                  <span
                    className="uk-margin-small-right"
                    data-uk-icon={`icon: ${icon}`}
                  />
                  {name}
                </SimpleLink>
              </li>
            ))}
          <li className="uk-nav-header uk-flex uk-flex-middle">
            <img
              className="uk-border-circle"
              src="/static/img/arthur-background.jpg"
              alt="Arthur Avatar"
              width="40"
              style={{ height: '40px' }}
            />
            <span className="uk-margin-small-left">Salut {user.firstName}</span>
          </li>
          <li>
            <a href="#">
              <span
                className="uk-margin-small-right"
                data-uk-icon="icon: user"
              />
              Mon profil
            </a>
          </li>
          <li>
            <SimpleLink href="/backoffice/parametres">
              <span
                className="uk-margin-small-right"
                data-uk-icon="icon: settings"
              />
              Paramètres
            </SimpleLink>
          </li>
          <li className="uk-nav-divider" />
          <li>
            <a href="#" onClick={logout}>
              <span
                className="uk-margin-small-right"
                data-uk-icon="icon: sign-out"
              />
              Se déconnecter
            </a>
          </li>
        </ul>
      </OffcanvasNoSSR>
    </header>
  );
};
HeaderConnected.propTypes = {
  isHome: PropTypes.bool,
};
HeaderConnected.defaultProps = {
  isHome: false,
};
export default HeaderConnected;
