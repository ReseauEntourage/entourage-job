import React from 'react';
import dynamic from 'next/dynamic';

export const CloseButtonNoSSR = dynamic(() => import('./CloseButton'), {
  ssr: false,
});
const CloseButton = () => (
  <button className="uk-offcanvas-close" type="button" data-uk-close />
);

export default CloseButton;
