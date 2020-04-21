/* global UIkit */
/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';

const ModalGeneric = ({ children, classNameSize: className, id, param }) => (
  <div id={id} className="uk-flex-top" data-uk-modal={param}>
    <div className={`uk-modal-dialog uk-margin-auto-vertical ${className}`}>
      <div className="uk-modal-body uk-padding-large">
        {children(() => UIkit.modal(`#${id}`).hide())}
      </div>
    </div>
  </div>
);
ModalGeneric.propTypes = {
  children: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  param: PropTypes.string,
  classNameSize: PropTypes.string,
};

ModalGeneric.defaultProps = {
  param: 'bg-close:false',
  classNameSize: 'uk-width-1-1 uk-width-2-3@l uk-width-1-2@xl',
};

export default ModalGeneric;
