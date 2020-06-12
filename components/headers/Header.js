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
  NavbarLogo, IconNoSSR,
} from '../utils';
import './Header.less';
import Button from "../utils/Button";

const Header = ({ isHome }) => {
  const LINKS = [
    { href: '/jeveuxaider', name: 'Aider' },
    { href: '/jeveuxrecruter', name: 'Recruter' },
    { href: '/jeveuxtravailler', name: 'Travailler' },
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
              ...LINKS.map((value, i) => {
                  if (router.asPath === value.href) {
                    return (
                      <div className="uk-navbar-item uk-padding-remove-horizontal">
                        <Button
                          href={value.href}
                          className="uk-padding-small uk-padding-remove-vertical">
                            {value.name}
                        </Button>
                      </div>
                    );
                  }
                  return (
                    <Link href={value.href} key={i}>
                      {/* Hack so that the links don't move when changing current page */}
                      <a style={{border: '1px solid transparent'}} className={`uk-visible@m ${router.asPath === value.href && 'uk-text-bold uk-text-primary'}`}>{value.name}</a>
                    </Link>
                  );
                }
              ),
              // separateurs en css .ent-nav
              <div className="uk-navbar-item uk-visible@m">
                <Button
                  href="/lescandidats"
                  style='primary'>
                  Je partage un CV{' '}<IconNoSSR name="chevron-right" />
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
