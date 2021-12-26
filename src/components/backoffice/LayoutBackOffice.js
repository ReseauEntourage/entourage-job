import React from 'react';
import PropTypes from 'prop-types';
import HeaderConnected from 'src/components/headers/HeaderConnected';
import Layout from 'src/components/Layout';

const LayoutBackOffice = ({ children, title }) => {
  return (
    <Layout title={`${title} - LinkedOut`} noIndex isBackoffice>
      <HeaderConnected />
      {children}
    </Layout>
  );
};
LayoutBackOffice.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  title: PropTypes.string,
};

LayoutBackOffice.defaultProps = {
  title: 'Espace perso',
};
export default LayoutBackOffice;
