import React from 'react';
import { LinkedinShareButton } from 'react-share';
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
    { href: '/jeveuxaider', name: 'je veux aider' },
    { href: '/jeveuxtravailler', name: 'je veux travailler' },
    { href: '/jeveuxrecruter', name: 'je veux recruter' },
  ];
  return (
    <header>
      <NavbarNoSSR
        sticky
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
                <LinkedinShareButton url={process.env.SERVER_URL}>
                  <Button href="#" visible="m" style="primary">
                    Partager l&apos;opération
                  </Button>
                </LinkedinShareButton>
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
