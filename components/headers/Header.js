import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { UserContext } from '../store/UserProvider';
import {
  Nav,
  NavbarNoSSR,
  OffcanvasNoSSR,
  HamburgerNoSSR,
  SimpleLink,
  NavbarLogo,
} from '../utils';
import './Header.less';

const Header = ({ isHome }) => {
  const LINKS = [
    { href: '/jeveuxtravailler', name: 'Travailler' },
    { href: '#', name: '|' },
    { href: '/jeveuxrecruter', name: 'Recruter' },
    { href: '#', name: '|' },
    { href: '/jeveuxaider', name: 'Aider' },
  ];

  return (
    <header>
      <NavbarNoSSR
        sticky=""
        className="uk-background-secondary uk-navbar-transparent uk-light ent-home"
        left={
          <>
            <NavbarLogo
              href="/"
              src="/static/img/logo-linkedout-by-entourage.png"
              alt="Linkedout"
              alwaysVisible={!isHome}
              style={{
                width: '170px',
                marginTop: '8px',
              }}
            />
          </>
        }
        right={
          <Nav
            navbar
            items={[
              ...LINKS.map((value) => (
                <Link href={value.href}>
                  <a
                    className="uk-visible@s"
                    style={{
                      // fontWeight: 500,
                      // fontSize: '1rem',
                      color: 'white',
                      textTransform: 'none',
                    }}
                  >
                    {value.name}
                  </a>
                </Link>
              )),
              <div className="uk-navbar-item uk-visible@s">
                <button
                  type="button"
                  className="uk-button uk-button-primary"
                  style={{
                    color: 'white',
                    backgroundColor: '#F55F24',
                    backgroundImage: 'none',
                    textTransform: 'none',
                    boder: null,
                    padding: '0px 20px',
                    borderRadius: '2px',
                  }}
                >
                  Voir les candidats &gt;
                </button>
              </div>,
              <HamburgerNoSSR href="#offcanvas" hidden="s" />,
            ]}
          />
        }
      />
      <OffcanvasNoSSR id="offcanvas">
        <ul className="uk-nav uk-nav-default">
          {LINKS.filter(({ href }) => href !== '#').map(
            ({ href, name }, index) => (
              <li key={index}>
                <SimpleLink href={href}>{name}</SimpleLink>
              </li>
            )
          )}
        </ul>
      </OffcanvasNoSSR>
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
