import React from 'react';
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

const Header = ({ items }) => {
  const basicItems = items.map(value => (
    <SimpleLink href={value.href} visible="m">
      {value.name}
    </SimpleLink>
  ));
  const specItems = [
    <div className="uk-navbar-item">
      <Button href="#" visible="m">
        Partager l&apos;opération
      </Button>
    </div>,
    <Hamburger href="#offcanvas" hidden="m" />,
  ];
  //   visible="m"
  return (
    <header>
      <Navbar
        left={<NavbarLogo href="/" src="/static/img/linkedout_by_entourage.png" alt="Linkedout" />}
        right={<Nav navbar items={basicItems.concat(specItems)} />}
      />
      <Offcanvas id="offcanvas">
        <Nav navbar={false} items={basicItems} />
      </Offcanvas>
    </header>
  );
};

export default Header;
