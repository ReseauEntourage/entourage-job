/* global UIkit */
import React from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Link from 'next/link';
import {
  Hamburger,
  Nav,
  Navbar,
  NavbarLogo,
  Offcanvas,
} from 'src/components/utils';

import Button from 'src/components/utils/Button';
import { EXTERNAL_LINKS } from 'src/constants';
import { event } from 'src/lib/gtag';
import TAGS from 'src/constants/tags';
import { IconNoSSR } from 'src/components/utils/Icon';

const LINKS = [
  { href: '/aider', name: 'Particuliers, agissez' },
  { href: '/entreprises', name: 'Entreprises, engagez-vous' },
];

const Header = ({ isHome }) => {
  const router = useRouter();
  return (
    <header id="header">
      <Navbar
        sticky=""
        className="uk-background-secondary uk-navbar-transparent ent-home"
        left={
          <div className="uk-flex uk-flex-middle">
            <NavbarLogo
              href="/"
              src="/static/img/linkedout_logo_white.png"
              alt="Linkedout"
              alwaysVisible={!isHome}
            />
            <div
              className={`uk-visible@m uk-margin-small-left uk-flex uk-flex-center uk-light ${
                isHome && 'uk-logo uk-animation-fade'
              }`}
            >
              <Button
                href={EXTERNAL_LINKS.DONATION}
                isExternal
                newTab
                onClick={() => {
                  return event(TAGS.FOOTER_DON_CLIC);
                }}
                style="default"
              >
                Faire un don&nbsp;
                <IconNoSSR name="chevron-right" />
              </Button>
            </div>
          </div>
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
                <Button
                  href={{
                    pathname: '/candidats',
                    query: { employed: false },
                  }}
                  style="primary"
                >
                  Découvrir les CV&nbsp;
                  <IconNoSSR name="chevron-right" />
                </Button>
              </div>,
              <Hamburger targetId="offcanvas-guest" hidden="m" />,
            ]}
          />
        }
      />
      <Offcanvas id="offcanvas-guest">
        <ul className="uk-nav uk-nav-default uk-margin-medium-top">
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
            LINKS.filter(({ href }) => {
              return href !== '#';
            }).map(({ href, name }, index) => {
              return (
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
                </li>
              );
            }),
          ]}
          <li className="uk-margin-small-top uk-flex uk-flex-center uk-padding-small">
            <Button
              href={{ pathname: '/candidats', query: { employed: false } }}
              onClick={() => {
                return UIkit.offcanvas('#offcanvas-guest').hide();
              }}
              style="primary"
            >
              Découvrir les CV&nbsp;
              <IconNoSSR name="chevron-right" />
            </Button>
          </li>
          <li className="uk-flex uk-flex-center uk-padding-small">
            <Button
              href={EXTERNAL_LINKS.DONATION}
              isExternal
              newTab
              onClick={() => {
                UIkit.offcanvas('#offcanvas-guest').hide();
                event(TAGS.FOOTER_DON_CLIC);
              }}
              style="default"
            >
              Faire un don&nbsp;
              <IconNoSSR name="chevron-right" />
            </Button>
          </li>
        </ul>
      </Offcanvas>
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
