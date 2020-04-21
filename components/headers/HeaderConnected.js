/* global UIkit */
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
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
import { UserContext } from '../store/UserProvider';
import ImgProfile from './ImgProfile';
import Dropdown from '../utils/Dropdown';

const HeaderConnected = ({ isHome }) => {
  const { user, logout } = useContext(UserContext);
  const router = useRouter();

  const LINKS_CONNECTED = {
    admin: [
      {
        href: '/backoffice/admin/membres',
        name: 'Les membres',
        icon: 'users',
      },
      {
        href: '/backoffice/admin/offres',
        name: 'Les opportunités',
        icon: 'list',
      },
    ],
    dropdown: [
      // { icon: 'user', name: 'Mon profil' },
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
    member: [
      {
        href: '/backoffice/candidat/offres',
        name: 'Mes offres',
        icon: 'list',
      },
      {
        href: '/backoffice/candidat/suivi',
        name: 'Mon Suivi',
        icon: 'file-text',
      },
      { href: '/backoffice/candidat/cv', name: 'Mon CV', icon: 'user' },
    ],
  };

  if (!user) return null;

  return (
    <header id="header">
      <NavbarNoSSR
        sticky=""
        mode="click"
        className={`uk-background-default uk-navbar-transparent ${
          isHome ? 'ent-home' : 'ent-header-shadow'
        }`}
        left={
          <>
            <NavbarLogo
              href="/"
              src="/static/img/01-linkedout-orange-complet.png"
              alt="Linkedout"
              // style={{
              //   width: '210px',
              //   /* marginTop: '8px', */
              // }}
            />
            <ul
              className="uk-navbar-nav"
              style={{ borderLeft: '1px solid lightgray' }}
            >
              {(user.role === 'Admin'
                ? LINKS_CONNECTED.admin
                : LINKS_CONNECTED.member
              ).map((link, index) => (
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
                  ({ href, name, onClick }, index) => (
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
                  )
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
            <HamburgerNoSSR targetId="offcanvas-logged" hidden="m" />
          </ul>
        }
      />
      <OffcanvasNoSSR id="offcanvas-logged">
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
          {(user.role === 'Admin'
            ? LINKS_CONNECTED.admin
            : LINKS_CONNECTED.member
          )
            .filter(({ href }) => href !== '#')
            .map(({ href, icon, name }, index) => (
              <li key={index}>
                <a
                  aria-hidden="true"
                  onClick={() => {
                    router.push(href);
                    UIkit.offcanvas('#offcanvas-logged').hide();
                  }}
                >
                  <span
                    className="uk-margin-small-right"
                    data-uk-icon={`icon: ${icon}`}
                  />
                  {name}
                </a>
              </li>
            ))}
          <li className="uk-nav-header uk-flex uk-flex-middle">
            <ImgProfile />
            <span className="uk-margin-small-left">Salut {user.firstName}</span>
          </li>
          {LINKS_CONNECTED.dropdown.map(
            ({ href, icon, name, onClick }, index) => (
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
                  <span
                    className="uk-margin-small-right"
                    data-uk-icon={`icon: ${icon}`}
                  />
                  {name}
                </a>
              </li>
            )
          )}
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
