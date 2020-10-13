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
  IconNoSSR,
} from '../utils';
import './Header.less';
import Button from '../utils/Button';

const LINKS = [
  { href: '/aider', name: 'Particuliers, agissez' },
  { href: '/entreprises', name: 'Entreprises, engagez-vous' },
];

const Header = ({ isHome }) => {
  const router = useRouter();
  return (
    <header id="header">
      <NavbarNoSSR
        sticky=""
        className="uk-background-secondary uk-navbar-transparent ent-home"
        left={
          <NavbarLogo
            href="/"
            src="/static/img/linkedout_logo_white.png"
            alt="Linkedout"
            alwaysVisible={!isHome}
          />
        }
        right={
          <Nav
            navbar
            items={[
              ...LINKS.map((link, i) => {
                if (router.asPath.includes(link.href)) {
                  return (
                    <div className="uk-navbar-item uk-padding-remove-horizontal uk-visible@m">
                      <Button
                        href={link.href}
                        style="default"
                        className="uk-padding-small uk-padding-remove-vertical"
                      >
                        {link.name}
                      </Button>
                    </div>
                  );
                }
                return (
                  <Link href={link.href} key={i}>
                    {/* Hack so that the links don't move when changing current page */}
                    <a
                      style={{ border: '1px solid transparent' }}
                      className={`uk-visible@m ${
                        router.asPath === link.href &&
                        'uk-text-bold uk-text-primary'
                      }`}
                    >
                      {link.name}
                    </a>
                  </Link>
                );
              }),
              // separateurs en css .ent-nav
              <div className="uk-navbar-item uk-visible@m">
                <Button href="/candidats" style="primary">
                  Découvrir les CV <IconNoSSR name="chevron-right" />
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
          <li className="uk-margin-small-top">
            <Button
              href="/candidats"
              onClick={() => UIkit.offcanvas('#offcanvas-guest').hide()}
              style="primary"
            >
              Découvrir les CV <IconNoSSR name="chevron-right" />
            </Button>
          </li>
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
