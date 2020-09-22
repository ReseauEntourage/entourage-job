/* global UIkit */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useResetForm } from '../../hooks';

export const ModalContext = React.createContext();

const ModalProvider = ({ children }) => {
  const [id, setId] = useState(null);
  const [show, setShow] = useState(false);
  const [close, setClose] = useState(false);
  const [form, resetForm] = useResetForm();
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex(index + 1);
  };

  const previous = () => {
    setIndex(index - 1);
  };

  const triggerModal = (modalId) => {
    setId(modalId);
    setShow(true);
  }

  useEffect(() => {
    if (close) {
      UIkit.modal(id).hide();
      setShow(false);
      setClose(false);
    } else if (resetForm) {
      resetForm();
    } else if (index) {
      setIndex(0);
    }
  }, [close, setClose]);

  useEffect(() => {
    if (show) {
      UIkit.modal(id).show();
    }
  }, [show, setShow]);

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
        index,
        next,
        previous,
        show,
        setShow,
        triggerModal,
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