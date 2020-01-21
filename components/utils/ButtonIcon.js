import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from './Icon';

const ButtonIcon = ({ name, onClick, className, href }) => (
  <a className="uk-text-emphasis" href={href} onClick={() => onClick()}>
    <IconNoSSR name={name} className={className} ratio={1.5} />
  </a>
);
ButtonIcon.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  href: PropTypes.string,
};
ButtonIcon.defaultProps = {
  href: undefined,
  className: undefined,
  onClick: () => {},
};

export default ButtonIcon;
