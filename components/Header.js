import React from 'react';
import {
  Nav,
  NavbarNoSSR,
  OffcanvasNoSSR,
  HamburgerNoSSR,
  SimpleLink,
  Button,
  NavbarLogo,
} from './utils';

const Header = () => {
  const LINKS = [
    { href: '/jeveuxaider', name: 'aider' },
    { href: '/jeveuxtravailler', name: 'travailler' },
    { href: '/jeveuxrecruter', name: 'recruter' },
  ];
  return (
    <header>
      <NavbarNoSSR
        left={
          <NavbarLogo
            href="/"
            src="/static/img/linkedout_by_entourage.png"
            alt="Linkedout"
          />
        }
        right={
          <Nav
            navbar
            items={[
              ...LINKS.map((value) => (
                <SimpleLink href={value.href} visible="m">
                  {value.name}
                </SimpleLink>
              )),
              <div className="uk-navbar-item">
                <Button href="#" visible="m" style="primary">
                  Partager l&apos;opération
                </Button>
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

export default Header;
