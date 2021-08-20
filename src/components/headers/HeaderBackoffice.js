import React from 'react';
import PropTypess from 'prop-types';
import { GridNoSSR } from 'src/components/utils';

const HeaderBackoffice = ({ title, description, children, childrenBottom }) => {
  return (
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
      <hr className="ent-divier-backoffice uk-margin-medium-top" />
    </div>
  );
};
HeaderBackoffice.propTypes = {
  title: PropTypess.string.isRequired,
  description: PropTypess.string.isRequired,
  children: PropTypess.oneOfType([
    PropTypess.arrayOf(PropTypess.node),
    PropTypess.node,
  ]),
  childrenBottom: PropTypess.bool,
};
HeaderBackoffice.defaultProps = {
  children: [],
  childrenBottom: false,
};
export default HeaderBackoffice;
