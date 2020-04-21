/* global UIkit */
import React from 'react';
import PropTypes from 'prop-types';

import ModalGeneric from './ModalGeneric';
import { Button, GridNoSSR } from '../utils';

const ModalConfirm = ({ id, onConfirm, text, buttonText }) => (
  <ModalGeneric id={id} classNameSize="uk-width-1-2@m">
    {(close) => (
      <>
        <p className="uk-text-center uk-text-lead">{text}</p>
        <GridNoSSR gap="small" center>
          <Button style="default" onClick={close}>
            Annuler
          </Button>
          <Button
            style="primary"
            onClick={() => {
              close();
              onConfirm();
            }}
          >
            {buttonText}
          </Button>
        </GridNoSSR>
      </>
    )}
  </ModalGeneric>
);
ModalConfirm.propTypes = {
  id: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default ModalConfirm;
