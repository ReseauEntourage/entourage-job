import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import UserProvider from './UserProvider';
import {
  Nav,
  NavbarNoSSR,
  OffcanvasNoSSR,
  HamburgerNoSSR,
  SimpleLink,
  NavbarLogo,
} from './utils';
import './Header.less';

const Header = (props) => {
  const { isHome } = props;
  const context = useContext(UserProvider);
  const { loadUser, removeUser } = context;
  console.log(context);
  loadUser();

  const LINKS = [
    { href: '/jeveuxaider', name: 'Je veux aider' },
    { href: '/jeveuxtravailler', name: 'Je veux travailler' },
    { href: '/jeveuxrecruter', name: 'Je veux recruter' },
  ];

  return (
    <header>
      <NavbarNoSSR
        sticky={isHome ? 'top: 300; animation: uk-animation-slide-top' : ''}
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
        center={
          <button
            onClick={removeUser}
            type="button"
            styles={
              context.isAuthentificated
                ? { display: 'block' }
                : { display: 'none' }
            }
          >
            <span className="uk-text-uppercase uk-label uk-label-success">
              connecté
            </span>
          </button>
        }
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
                <button type="button" className="uk-button uk-button-primary">
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
    </header>
  );
};
Header.contextType = UserProvider;
Header.propTypes = {
  isHome: PropTypes.bool,
};
Header.defaultProps = {
  isHome: false,
};
export default Header;
