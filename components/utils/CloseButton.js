import React from 'react';
import dynamic from 'next/dynamic';

export const CloseButtonNoSSR = dynamic(() => import('./CloseButton'), {
  ssr: false,
});
const CloseButton = ({ className }) => {
  className = className !== undefined ? className : "uk-offcanvas-close";
  return (
    <button className={className} type="button" data-uk-close />
  );
};

CloseButton.defaultProps = {
  className: undefined,
};

export default CloseButton;
