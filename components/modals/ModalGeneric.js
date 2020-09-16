/* global UIkit */
/* eslint-disable no-undef */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
// import { ModalContext } from '../store/ModalProvider';

const ModalGeneric = ({ children, classNameSize: className, param, id }) => {
  // const { id } = useContext(ModalContext);

  return (
    <div id={id} className="uk-flex-top" data-uk-modal={param} >
      <div className={`uk-modal-dialog uk-margin-auto-vertical ${className}`}>
        <div className="uk-modal-body uk-padding-large">
          {children}
        </div>
      </div>
    </div>
  );
}

ModalGeneric.propTypes = {
  children: PropTypes.element.isRequired,
  // id: PropTypes.string.isRequired,
  param: PropTypes.string,
  classNameSize: PropTypes.string,
  // resetForm: PropTypes.func
};

ModalGeneric.defaultProps = {
  param: 'bg-close:false',
  classNameSize: 'uk-width-1-1 uk-width-2-3@l uk-width-1-2@xl',
  // resetForm: () => { }
};

export default ModalGeneric;
