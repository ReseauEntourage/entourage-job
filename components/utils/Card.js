import React from 'react';
import { PropTypes } from 'prop-types';

// todo create a card component with each class parameters
const Card = ({ title, style, body, hover, size, children }) => {
  let classBuffer = 'uk-card';
  if (style) classBuffer += ` uk-card-${style}`;
  if (body) classBuffer += ` uk-card-body`;
  if (hover) classBuffer += ` uk-card-hover`;
  if (size) classBuffer += ` uk-card-${size}`;

  return (
    <div className={classBuffer}>
      {title && <h3 className="uk-card-title">{title}</h3>}
      {children}
    </div>
  );
};
Card.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  style: PropTypes.oneOf(['default', 'primary', 'secondary']),
  title: PropTypes.node,
  body: PropTypes.bool,
  hover: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'large']),
};
Card.defaultProps = {
  style: 'default',
  title: undefined,
  body: true,
  hover: false,
  size: undefined,
};

export default Card;
