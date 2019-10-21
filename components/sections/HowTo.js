import React from 'react';
import PropTypes from 'prop-types';
import { Section } from '../utils';

const HowTo = ({ title, children, colLarge }) => {
  let classChildWidth =
    'uk-child-width-1-4@l uk-child-width-1-3@m uk-child-width-1-2@s';
  switch (colLarge) {
    case 3:
      classChildWidth =
        'uk-child-width-1-3@l uk-child-width-1-2@m uk-child-width-1-1@s';
      break;
    case 2:
      classChildWidth = 'uk-child-width-1-2@l uk-child-width-1-1@m';
      break;
    default:
      classChildWidth =
        'uk-child-width-1-4@l uk-child-width-1-3@m uk-child-width-1-2@s';
  }

  return (
    <Section style="default">
      {title}
      <div className={`${classChildWidth} uk-flex-center`} data-uk-grid>
        {children}
      </div>
    </Section>
  );
};

HowTo.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.elementType).isRequired,
  colLarge: PropTypes.number,
};

HowTo.defaultProps = {
  colLarge: 4,
};

export default HowTo;
