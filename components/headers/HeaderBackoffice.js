import React from 'react';
import PropsTypes from 'prop-types';
import { GridNoSSR } from '../utils';

const HeaderBackoffice = ({ title, description, children }) => (
  <div className="uk-margin-large-bottom">
    <GridNoSSR gap="small" row eachWidths={['expand', 'auto']}>
      <div>
        <h2 className="uk-text-bold">{title}</h2>
        <p className="uk-text-lead uk-width-2-3@m">{description}</p>
      </div>
      {children}
    </GridNoSSR>
    <hr className="ent-divier-backoffice uk-margin-large-top " />
  </div>
);
HeaderBackoffice.propTypes = {
  title: PropsTypes.string.isRequired,
  description: PropsTypes.string.isRequired,
  children: PropsTypes.oneOfType([
    PropsTypes.arrayOf(PropsTypes.node),
    PropsTypes.node,
  ]),
};
HeaderBackoffice.defaultProps = {
  children: [],
};
export default HeaderBackoffice;
