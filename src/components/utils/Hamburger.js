import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { UIKIT_SCREENS } from 'src/components/variables';

const Hamburger = ({ hidden, targetId, visible }) => {
  let classBuffer = '';
  if (hidden) classBuffer += `uk-hidden@${hidden}`;
  if (visible) classBuffer += `uk-visible@${visible}`;
  return (
    <button
      type="button"
      aria-label="hamburger"
      className={`uk-navbar-toggle ${classBuffer}`}
      data-uk-toggle={`target: #${targetId}`}
      data-uk-navbar-toggle-icon
    />
  );
};
Hamburger.propTypes = {
  hidden: PropTypes.oneOf(UIKIT_SCREENS),
  visible: PropTypes.oneOf(UIKIT_SCREENS),
  targetId: PropTypes.string.isRequired,
};
Hamburger.defaultProps = { hidden: undefined, visible: undefined };

export const HamburgerNoSSR = dynamic(
  () => {
    return import('src/components/utils/Hamburger');
  },
  {
    ssr: false,
  }
);

export default Hamburger;
