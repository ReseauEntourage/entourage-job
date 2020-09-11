/* global UIkit */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const ModalContext = React.createContext();

const ModalProvider = ({ children }) => {
  const [id, setId] = useState(null);
  const [close, setClose] = useState(false);
  const [resetForm, setResetForm] = useState(undefined);


  useEffect(() => {
    if (close) {
      UIkit.modal(`#${id}`).hide();
    } else if (resetForm) {
      resetForm();
    }
  }, [close, setClose]);

  useEffect(() => {
    console.log('id', id);
  }, [id, setId]);

  useEffect(() => {
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
  children: PropTypes.element.isRequired,
};

export default ModalProvider;