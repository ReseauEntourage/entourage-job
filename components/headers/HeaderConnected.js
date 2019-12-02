import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import {
  NavbarNoSSR,
  OffcanvasNoSSR,
  HamburgerNoSSR,
  NavbarLogo,
  IconNoSSR,
} from '../utils';
import './Header.less';
import HeaderUserDropdown from './HeaderUserDropdown';

const HeaderConnected = ({ isHome }) => {
  const LINKS_CONNECTED = [
    { href: '/backoffice/cv/edit', name: 'Mon espace', icon: 'user' },
    { href: '#', name: 'Mes opportunités', icon: 'list' },
    { href: '#', name: 'Mur du love', icon: 'heart' },
  ];

  return (
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
            {LINKS_CONNECTED.map((link, index) => (
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
          <HamburgerNoSSR href="#offcanvas" hidden="m" />
        </>
      }
      right={
        <ul className="uk-navbar-nav">
          <li style={{ borderLeft: '1px solid lightgray' }}>
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
        </ul>
      }
    />
  );
};
HeaderConnected.propTypes = {
  isHome: PropTypes.bool,
};
HeaderConnected.defaultProps = {
  isHome: false,
};
export default HeaderConnected;
