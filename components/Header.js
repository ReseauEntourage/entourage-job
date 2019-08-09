import React from 'react';
import PropTypes from 'prop-types';
import { Nav, Navbar } from './utils/navs';
import { SimpleLink, Button, Hamburger, NavbarLogo } from './utils/links';

const Offcanvas = ({ id, children }) => (
  <div data-uk-offcanvas="mode: push; overlay: true" id={id}>
    <div className="uk-offcanvas-bar">
      <button className="uk-offcanvas-close" type="button" data-uk-close />
      {children}
    </div>
  </div>
);
Offcanvas.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const Header = ({ items }) => (
  <header>
    <Navbar
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
            <Hamburger href="#offcanvas" hidden="m" />,
          ]}
        />
      }
    />
    <Offcanvas id="offcanvas">
      <Nav
        navbar={false}
        items={items.map((value) => (
          <SimpleLink href={value.href}>{value.name}</SimpleLink>
        ))}
      />
    </Offcanvas>
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
