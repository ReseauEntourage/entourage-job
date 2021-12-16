import React from 'react';
import PropTypes from 'prop-types';

import ModalGeneric from 'src/components/modals/ModalGeneric';
import { Button, Grid } from 'src/components/utils';
import { useModalContext } from 'src/components/modals/Modal';

const ModalConfirm = ({ onConfirm, text, buttonText }) => {
  const { onClose } = useModalContext();
  return (
    <ModalGeneric title={text}>
      <Grid gap="small" center>
        <Button style="default" onClick={onClose}>
          Annuler
        </Button>
        <Button
          style="primary"
          onClick={() => {
            onClose();
            onConfirm();
          }}
        >
          {buttonText}
        </Button>
      </Grid>
    </ModalGeneric>
  );
};
ModalConfirm.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default ModalConfirm;
