/* global UIkit */
import React from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Link from 'next/link';
import {
  Nav,
  NavbarNoSSR,
  OffcanvasNoSSR,
  HamburgerNoSSR,
  NavbarLogo,
} from '../utils';
import './Header.less';
import Button from "../utils/Button";

const Header = ({ isHome }) => {
  const LINKS = [
    { href: '/jeveuxtravailler', name: 'Travailler' },
    { href: '/jeveuxrecruter', name: 'Recruter' },
    { href: '/jeveuxaider', name: 'Aider' },
  ];
  const router = useRouter();
  return (
    <header id="header">
      <NavbarNoSSR
        sticky=""
        className="uk-background-secondary uk-navbar-transparent ent-home"
        left={
          <NavbarLogo
            href="/"
            src="/static/img/03-linkedout-blanc-complet.png"
            alt="Linkedout"
            alwaysVisible={!isHome}
            style={{
              width: '210px',
              /* marginTop: '8px', */
            }}
          />
        }
        right={
          <Nav
            navbar
            items={[
              ...LINKS.map((value, i) => (
                <Link href={value.href} key={i}>
                  <a className="uk-visible@m">{value.name}</a>
                </Link>
              )),
              // separateurs en css .ent-nav
              <div className="uk-navbar-item uk-visible@m">
                <Button
                  href="/lescandidats"
                  style='primary'>
                  Je partage un CV &gt;
                </Button>
              </div>,
              <HamburgerNoSSR targetId="offcanvas-guest" hidden="m" />,
            ]}
          />
        }
      />
      <OffcanvasNoSSR id="offcanvas-guest">
        <ul className="uk-nav uk-nav-default">
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
          </li>
          {[
            LINKS.filter(({ href }) => href !== '#').map(
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
