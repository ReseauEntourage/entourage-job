import React from 'react';
import Head from 'next/head';
import { Container } from 'next/app';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import Header from '../Header';

const LayoutBackOffice = ({ children, title, router }) => {
  return (
    <Container>
      <Head>
        <title>{`${title} - LinkedOut`}</title>
        <link rel="icon" type="image/png" href="/static/img/fav.png" />
      </Head>
      <Header isHome={router.asPath === `/backoffice/cv/edit`} />
      {children}
    </Container>
  );
};
LayoutBackOffice.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  title: PropTypes.string,
  router: PropTypes.shape({
    asPath: PropTypes.string,
  }).isRequired,
};

LayoutBackOffice.defaultProps = {
  title: 'Espace perso',
};
export default withRouter(LayoutBackOffice);
