/* global UIkit */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import {
  Hamburger,
  Navbar,
  NavbarLogo,
  Offcanvas,
  SimpleLink,
} from 'src/components/utils';

import { UserContext } from 'src/components/store/UserProvider';
import ImgProfile from 'src/components/headers/ImgProfile';
import Dropdown from 'src/components/utils/Dropdown';
import { EXTERNAL_LINKS } from 'src/constants';
import { useNotifBadges } from 'src/hooks';
import { IconNoSSR } from 'src/components/utils/Icon';

const HeaderConnected = ({ isHome }) => {
  const { user, logout } = useContext(UserContext);
  const router = useRouter();

  const badges = useNotifBadges(user, router.asPath);

  const LINKS_CONNECTED = {
    admin: [
      {
        href: '/backoffice/admin/membres',
        name: 'Les membres',
        icon: 'users',
        badge: 'members',
      },
      {
        href: '/backoffice/admin/offres',
        name: 'Les opportunités',
        icon: 'list',
        badge: 'offers',
      },
    ],
    dropdown: [
      {
        href: '/backoffice/parametres',
        icon: 'settings',
        name: 'Paramètres',
      },
      {
        onClick: logout,
        icon: 'sign-out',
        name: 'Se déconnecter',
      },
    ],
    candidat: [
      {
        href: '/backoffice/candidat/offres',
        name: 'Mes offres',
        icon: 'list',
        badge: 'offers',
      },
      {
        href: '/backoffice/candidat/suivi',
        name: 'Mon suivi',
        icon: 'file-text',
        badge: 'note',
      },
      {
        href: '/backoffice/candidat/cv',
        name: 'Mon CV',
        icon: 'user',
        badge: 'cv',
      },
    ],
    coach: [
      {
        href: '/backoffice/candidat/offres',
        name: 'Offres',
        icon: 'list',
        badge: 'offers',
      },
      {
        href: '/backoffice/candidat/suivi',
        name: 'Suivi',
        icon: 'file-text',
        badge: 'note',
      },
      {
        href: '/backoffice/candidat/cv',
        name: 'CV',
        icon: 'user',
        badge: 'cv',
      },
      {
        href: EXTERNAL_LINKS.TOOLBOX,
        name: 'Boîte à outils',
        icon: 'question',
        external: true,
      },
    ],
  };

  if (!user) return null;

  return (
    <header id="header">
      <Navbar
        sticky=""
        mode="click"
        className={`uk-background-default uk-navbar-transparent ${
          isHome ? 'ent-home' : 'ent-header-shadow'
        }`}
        left={
          <>
            <NavbarLogo
              href="/"
              src="/static/img/linkedout_logo_orange.png"
              alt="Linkedout"
            />
            <ul
              className="uk-navbar-nav"
              style={{ borderLeft: '1px solid lightgray' }}
            >
              {LINKS_CONNECTED[user.role.toLowerCase()].map(
                ({ href, badge, icon, name, external }, index) => {
                  return (
                    <li
                      key={index}
                      style={{ borderRight: '1px solid lightgray' }}
                    >
                      <SimpleLink
                        href={href}
                        isExternal={external}
                        target={external ? '_blank' : '_self'}
                        className="uk-visible@m uk-flex uk-flex-middle"
                      >
                        <span
                          className="uk-margin-small-right"
                          style={{
                            ...(router.asPath.includes(href)
                              ? { color: 'black' }
                              : {}),
                          }}
                        >
                          <IconNoSSR name={icon} />
                        </span>
                        <span
                          style={{
                            textTransform: 'none',
                            fontSize: '1rem',
                            ...(router.asPath.includes(href)
                              ? { color: 'black', fontWeight: 500 }
                              : {}),
                          }}
                        >
                          {name}
                        </span>
                        {badges[badge] > 0 && (
                          <div>
                            &nbsp;
                            <div className="uk-badge">{badges[badge]}</div>
                          </div>
                        )}
                      </SimpleLink>
                    </li>
                  );
                }
              )}
            </ul>
          </>
        }
        right={
          <ul className="uk-navbar-nav">
            <li
              className="uk-visible@m"
              style={{ borderLeft: '1px solid lightgray' }}
            >
              <a
                id="nav-profile"
                style={{
                  fontWeight: 500,
                  fontSize: '1rem',
                  color: 'black',
                  textTransform: 'none',
                }}
              >
                <ImgProfile />
                <span className="uk-margin-small-left">
                  Salut {user.firstName}
                </span>
                <IconNoSSR name="triangle-down" />
              </a>
              <Dropdown
                dividers={[2]}
                id="dropdown-nav-profile"
                boundaryId="nav-profile"
              >
                {LINKS_CONNECTED.dropdown.map(
                  ({ href, name, onClick }, index) => {
                    return (
                      <a
                        key={index}
                        aria-hidden="true"
                        onClick={() => {
                          if (href) {
                            router.push(href);
                          }
                          if (onClick) {
                            onClick();
                          }
                        }}
                      >
                        {name}
                      </a>
                    );
                  }
                )}
              </Dropdown>
            </li>
            {/* <li style={{ borderLeft: '1px solid lightgray' }}>
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
            </li> */}
            <Hamburger targetId="offcanvas-logged" hidden="m" />
          </ul>
        }
      />
      <Offcanvas id="offcanvas-logged">
        <ul className="uk-nav uk-nav-default">
          <li>
            <SimpleLink href="/">
              <IconNoSSR name="home" className="uk-margin-small-right" />
              Accueil
            </SimpleLink>
          </li>
          {LINKS_CONNECTED[user.role.toLowerCase()]
            .filter(({ href }) => {
              return href !== '#';
            })
            .map(({ href, icon, name, badge }, index) => {
              return (
                <li key={index}>
                  <a
                    aria-hidden="true"
                    onClick={() => {
                      router.push(href);
                      UIkit.offcanvas('#offcanvas-logged').hide();
                    }}
                  >
                    <IconNoSSR name={icon} className="uk-margin-small-right" />
                    {name}
                  </a>
                  {badges[badge] > 0 && (
                    <div>
                      &nbsp;
                      <div className="uk-badge">{badges[badge]}</div>
                    </div>
                  )}
                </li>
              );
            })}
          <li className="uk-nav-header uk-flex uk-flex-middle">
            <ImgProfile />
            <span className="uk-margin-small-left">Salut {user.firstName}</span>
          </li>
          {LINKS_CONNECTED.dropdown.map(
            ({ href, icon, name, onClick }, index) => {
              return (
                <li key={index}>
                  <a
                    aria-hidden="true"
                    onClick={() => {
                      if (href) {
                        router.push(href);
                      }
                      if (onClick) {
                        onClick();
                      }
                      UIkit.offcanvas('#offcanvas-logged').hide();
                    }}
                  >
                    <IconNoSSR name={icon} className="uk-margin-small-right" />
                    {name}
                  </a>
                </li>
              );
            }
          )}
        </ul>
      </Offcanvas>
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
