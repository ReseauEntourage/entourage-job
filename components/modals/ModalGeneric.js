/* global UIkit */
/* eslint-disable no-undef */
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

const ModalGeneric = ({ children, classNameSize: className, id, param, resetForm }) => {

  // Fix because of bug where multiple modals with the same id are created
  useEffect(() => {
    const modals = document.querySelectorAll(`#${id}`);
    if(modals.length > 1) {
      modals[1].remove();
    }
  }, []);

  return (
    <div id={id} className="uk-flex-top" data-uk-modal={param}>
      <div className={`uk-modal-dialog uk-margin-auto-vertical ${className}`}>
        <div className="uk-modal-body uk-padding-large">
          {children(() => {
            UIkit.modal(`#${id}`).hide();
            resetForm();
          })}
        </div>
      </div>
    </div>
  );
}
ModalGeneric.propTypes = {
  children: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  param: PropTypes.string,
  classNameSize: PropTypes.string,
  resetForm: PropTypes.func
};

ModalGeneric.defaultProps = {
  param: 'bg-close:false',
  classNameSize: 'uk-width-1-1 uk-width-2-3@l uk-width-1-2@xl',
  resetForm: () => {}
};

export default ModalGeneric;
