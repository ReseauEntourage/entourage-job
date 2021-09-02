import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'src/components/utils';

const HeaderBackoffice = ({ title, description, children, childrenBottom }) => {
  return (
    <div className="uk-margin-large-bottom">
      <Grid
        gap="small"
        column={childrenBottom}
        eachWidths={['expand@s', 'auto']}
      >
        <div>
          <h2 className="uk-text-bold">{title}</h2>
          <p className="uk-text-lead uk-width-2-3@m">{description}</p>
        </div>
        <div>{children}</div>
      </Grid>
      <hr className="ent-divier-backoffice uk-margin-medium-top" />
    </div>
  );
};
HeaderBackoffice.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  childrenBottom: PropTypes.bool,
};
HeaderBackoffice.defaultProps = {
  children: undefined,
  childrenBottom: false,
};
export default HeaderBackoffice;
