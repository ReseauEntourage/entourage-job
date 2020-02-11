import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { NavbarNoSSR, HamburgerNoSSR, NavbarLogo, IconNoSSR } from '../utils';
import './Header.less';
import HeaderUserDropdown from './HeaderUserDropdown';
import { UserContext } from '../store/UserProvider';

const LINKS_CONNECTED = {
  admin: [{ href: '/backoffice/members', name: 'Les membres', icon: 'users' }],
  member: [
    { href: '/backoffice/cv/edit', name: 'Mon espace', icon: 'user' },
    {
      href: '/backoffice/mesopportunites',
      name: 'Mes opportunités',
      icon: 'list',
    },
  ],
};

const HeaderConnected = ({ isHome }) => (
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
          <UserContext.Consumer>
            {({ user }) => {
              let links = [];
              if (user.role === 'Admin') {
                links = LINKS_CONNECTED.admin;
              }
              if (user.role === 'Candidat' || user.role === 'Coach') {
                links = LINKS_CONNECTED.member;
              }

              return links.map((link, index) => (
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
              ));
            }}
          </UserContext.Consumer>
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
HeaderConnected.propTypes = {
  isHome: PropTypes.bool,
};
HeaderConnected.defaultProps = {
  isHome: false,
};
export default HeaderConnected;
