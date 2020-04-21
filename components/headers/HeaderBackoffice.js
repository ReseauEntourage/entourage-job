import React from 'react';
import PropsTypes from 'prop-types';
import { GridNoSSR } from '../utils';

const HeaderBackoffice = ({ title, description, children, childrenBottom }) => (
  <div className="uk-margin-large-bottom">
    <GridNoSSR
      gap="small"
      column={childrenBottom}
      eachWidths={['expand@s', 'auto']}
    >
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
  childrenBottom: PropsTypes.bool,
};
HeaderBackoffice.defaultProps = {
  children: [],
  childrenBottom: false,
};
export default HeaderBackoffice;
