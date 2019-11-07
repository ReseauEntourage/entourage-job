import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from '../utils/Icon';

const HeaderModal = ({ children }) => (
  <div className="uk-flex">
    <div className="uk-margin-medium-right">
      <span className="uk-text-primary">
        <IconNoSSR name="linkedout-contract" ratio={1.5} />
      </span>
    </div>
    <div className="">
      <h3 className="uk-text-bold">{children}</h3>
    </div>
  </div>
);
HeaderModal.propTypes = {
  children: PropTypes.element.isRequired,
};
export default HeaderModal;