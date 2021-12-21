import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from 'src/components/utils/Icon';

const HeaderModal = ({ children }) => {
  return (
    <div className="uk-flex uk-flex-middle uk-margin-medium-bottom">
      <div
        className="uk-margin-small-right uk-flex uk-flex-center uk-flex-middle"
        style={{ width: 30 }}
      >
        <span className="uk-text-primary">
          <IconNoSSR name="linkedout-contract" ratio={1.2} />
        </span>
      </div>
      <div className="">
        <h3 className="uk-text-bold uk-margin-remove">{children}</h3>
      </div>
    </div>
  );
};
HeaderModal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
};
export default HeaderModal;
