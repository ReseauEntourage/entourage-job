import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { UserContext } from './store/UserProvider';
import {
  Nav,
  NavbarNoSSR,
  OffcanvasNoSSR,
  HamburgerNoSSR,
  SimpleLink,
  NavbarLogo,
  IconNoSSR,
} from './utils';
import './Header.less';

const Header = ({ isHome }) => {
  const LINKS = [
    { href: '/jeveuxaider', name: 'Je veux aider' },
    { href: '/jeveuxtravailler', name: 'Je veux travailler' },
    { href: '/jeveuxrecruter', name: 'Je veux recruter' },
  ];

  const LINKS_CONNECTED = [
    { href: '/backoffice/cv/edit', name: 'Mon espace', icon: 'user' },
    { href: '#', name: 'Mes opportunités', icon: 'list' },
    { href: '#', name: 'Mur du love', icon: 'heart' },
  ];

  return (
    <header style={{ borderBottom: '3px solid darkgray' }}>
      <UserContext.Consumer>
        {({ isAuthentificated, logout, user }) => (
          <>
            {isAuthentificated ? (
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
                      {LINKS_CONNECTED.map((link) => (
                        <li style={{ borderRight: '1px solid lightgray' }}>
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
                    <HamburgerNoSSR href="#offcanvas" hidden="m" />
                  </>
                }
                right={
                  <ul className="uk-navbar-nav">
                    <li style={{ borderLeft: '1px solid lightgray' }}>
                      <a
                        className="uk-visible@m uk-text-middle"
                        style={{
                          fontWeight: 500,
                          fontSize: '1rem',
                          color: 'black',
                          textTransform: 'none',
                        }}
                      >
                        <div className="uk-inline ">
                          <button
                            type="button"
                            className="uk-button uk-button-text"
                            style={{ textTransform: 'none' }}
                          >
                            <img
                              className="uk-border-circle"
                              src="/static/img/arthur-background.jpg"
                              width="40"
                              height="40"
                              alt="Menu"
                            />
                            <span className="uk-margin-small-left">
                              Salut {user.firstName}
                            </span>
                            <IconNoSSR name="triangle-down" />
                          </button>
                          <div uk-dropdown="mode: click">
                            <ul className="uk-nav uk-dropdown-nav">
                              <li>
                                <a href="#">Mon profil</a>
                              </li>
                              <li>
                                <a href="#">Paramètres</a>
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
                      </a>
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
                  </ul>
                }
              />
            ) : (
              <>
                <NavbarNoSSR
                  sticky={
                    isHome ? 'top: 300; animation: uk-animation-slide-top' : ''
                  }
                  className={`uk-background-default uk-navbar-transparent ${
                    isHome ? 'ent-home' : 'ent-header-shadow'
                  }`}
                  left={
                    <NavbarLogo
                      href="/"
                      src="/static/img/linkedout_by_entourage.png"
                      alt="Linkedout"
                    />
                  }
                  /* center={
                <UserContext.Consumer>
                  {({ isAuthentificated, logout }) => (
                    <div
                      onClick={logout}
                      className={`uk-text-uppercase uk-label ${
                        isAuthentificated ? 'uk-label-success' : 'uk-label-warning'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      {isAuthentificated ? 'connecté' : 'déconnecté'}
                    </div>
                  )}
                </UserContext.Consumer>
              } */
                  right={
                    <Nav
                      navbar
                      items={[
                        ...LINKS.map((value) => (
                          <Link href={value.href}>
                            <a
                              className="uk-visible@m"
                              style={{
                                fontWeight: 500,
                                fontSize: '1rem',
                                color: 'black',
                                textTransform: 'none',
                              }}
                            >
                              {value.name}
                            </a>
                          </Link>
                        )),
                        <div className="uk-navbar-item uk-visible@m">
                          <button
                            type="button"
                            className="uk-button uk-button-primary"
                          >
                            Voir les candidats
                          </button>
                        </div>,
                        <HamburgerNoSSR href="#offcanvas" hidden="m" />,
                      ]}
                    />
                  }
                />
                <OffcanvasNoSSR id="offcanvas">
                  <Nav
                    navbar={false}
                    items={LINKS.map((value) => (
                      <SimpleLink href={value.href}>{value.name}</SimpleLink>
                    ))}
                  />
                </OffcanvasNoSSR>
              </>
            )}
          </>
        )}
      </UserContext.Consumer>
    </header>
  );
};
Header.propTypes = {
  isHome: PropTypes.bool,
};
Header.defaultProps = {
  isHome: false,
};
export default Header;
