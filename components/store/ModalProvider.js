/* global UIkit */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useResetForm } from '../../hooks';

export const ModalContext = React.createContext();

const ModalProvider = ({ children }) => {
  const [id, setId] = useState(null);
  const [close, setClose] = useState(false);
  const [form, resetForm] = useResetForm();

  useEffect(() => {
    if (close) {
      UIkit.modal(`#${id}`).hide();
    } else if (resetForm) {
      resetForm();
    }
  }, [close, setClose]);

  return (
    <ModalContext.Provider
      value={{
        children,
        id,
        setId,
        close,
        setClose,
        form,
        resetForm,
      }}
    >
      {children}
    </ModalContext.Provider >
  );
}

ModalProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ModalProvider;