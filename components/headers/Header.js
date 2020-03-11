/* global UIkit */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
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
    { href: '/jeveuxaider', name: 'Aider' },
    { href: '#', name: '|' },
    { href: '/jeveuxrecruter', name: 'Recruter' },
    { href: '#', name: '|' },
    { href: '/jeveuxtravailler', name: 'Travailler' },
  ];
  const router = useRouter();
  return (
    <header>
      <NavbarNoSSR
        sticky=""
        className="uk-background-secondary uk-navbar-transparent uk-light ent-home"
        left={
          <>
            <NavbarLogo
              href="/"
              src="/static/img/03-linkedout-blanc-complet.png"
              alt="Linkedout"
              alwaysVisible={!isHome}
              style={{
                width: '210px',
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
                  Je partage un CV &gt;
                </button>
              </div>,
              <HamburgerNoSSR targetId="offcanvas-guest" hidden="s" />,
            ]}
          />
        }
      />
      <OffcanvasNoSSR id="offcanvas-guest">
        <ul className="uk-nav uk-nav-default">
          {[
            <li>
              <a
                aria-hidden="true"
                onClick={() => {
                  router.push('/');
                  UIkit.offcanvas('#offcanvas-guest').hide();
                }}
              >
                Accueil
              </a>
            </li>,
            ...LINKS.filter(({ href }) => href !== '#').map(
              ({ href, name }, index) => (
                <li key={index}>
                  <a
                    aria-hidden="true"
                    onClick={() => {
                      router.push(href);
                      UIkit.offcanvas('#offcanvas-guest').hide();
                    }}
                  >
                    {name}
                  </a>
                  {/* <SimpleLink scroll={false} href={href}>
                </SimpleLink> */}
                </li>
              )
            ),
          ]}
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
