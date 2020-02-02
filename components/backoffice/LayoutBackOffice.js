import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import HeaderConnected from '../headers/HeaderConnected';

const LayoutBackOffice = ({ children, title }) => (
  <>
    <Head>
      <title>{`${title} - LinkedOut`}</title>
      <link rel="icon" type="image/png" href="/static/img/fav.png" />
    </Head>
    <HeaderConnected />
    {children}
  </>
);
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
export default LayoutBackOffice;
