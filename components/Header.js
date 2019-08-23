import React from 'react';
import PropTypes from 'prop-types';
import Nav from './utils/Nav';
import { NavbarNoSSR } from './utils/Navbar';
import { SimpleLink, Button, NavbarLogo } from './utils';
import { HamburgerNoSSR } from './utils/Hamburger';
import { OffcanvasNoSSR } from './utils/Offcanvas';

const Header = ({ items }) => (
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
            ...items.map((value) => (
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
        items={items.map((value) => (
          <SimpleLink href={value.href}>{value.name}</SimpleLink>
        ))}
      />
    </OffcanvasNoSSR>
  </header>
);
Header.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      href: PropTypes.string,
    })
  ).isRequired,
};

export default Header;
