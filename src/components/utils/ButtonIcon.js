import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'src/components/utils/Icon';

const ButtonIcon = ({ name, onClick, className, href, ratio }) => {
  return (
    <a
      className="uk-text-emphasis uk-flex uk-flex-middle"
      href={href}
      onClick={() => {
        return onClick();
      }}
    >
      <Icon name={name} className={className} ratio={ratio} />
    </a>
  );
};
ButtonIcon.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  href: PropTypes.string,
  ratio: PropTypes.number,
};
ButtonIcon.defaultProps = {
  href: undefined,
  className: undefined,
  ratio: 1.5,
  onClick: () => {},
};

export default ButtonIcon;
