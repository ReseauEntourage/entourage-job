/* global UIkit */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ModalGeneric from './ModalGeneric';
import { Button, GridNoSSR } from '../utils';
import { ModalContext } from '../store/ModalProvider';

const ModalConfirm = ({
  id,
  buttonText,
  onConfirm,
  text,
}) => {
  const {
    setClose
  } = useContext(ModalContext);
  return <ModalGeneric id={id} classNameSize="uk-width-1-2@m">
    <>
      <p className="uk-text-center uk-text-lead">{text}</p>
      <GridNoSSR gap="small" center>
        <Button style="default" onClick={() => setClose(true)}>
          Annuler
          </Button>
        <Button style="primary" onClick={() => {
          setClose(true);
          onConfirm();
        }}>
          {buttonText}
        </Button>
      </GridNoSSR>
    </>
  </ModalGeneric>;
};

ModalConfirm.propTypes = {
  buttonText: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
};
export default ModalConfirm;