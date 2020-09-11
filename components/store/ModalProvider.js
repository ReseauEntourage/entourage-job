/* global UIkit */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const ModalContext = React.createContext();

const ModalProvider = ({ children }) => {
  const [id, setId] = useState(null);
  const [close, setClose] = useState(false);
  const [resetForm, setResetForm] = useState(undefined);

  console.log(id);

  useEffect(() => {
    if (close) {
      UIkit.modal(`#${id}`).hide();
    } else if (resetForm) {
      resetForm();
    }
  }, [close, setClose]);

  useEffect(() => {
    console.log(id);
  }, [id, setId]);

  useEffect(() => {
    console.log(resetForm);
  }, [resetForm, setResetForm]);

  return (
    <ModalContext.Provider
      value={{ close, setClose, id, setId, children, resetForm, setResetForm }}
    >
      {children}
    </ModalContext.Provider >
  );
}

ModalProvider.propTypes = {
  // id: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  // param: PropTypes.string,
  // classNameSize: PropTypes.string,
  resetForm: PropTypes.func,
};

ModalProvider.defaultProps = {
  param: 'bg-close:false',
  classNameSize: 'uk-width-1-1 uk-width-2-3@l uk-width-1-2@xl',
  resetForm: undefined,
};

export default ModalProvider;