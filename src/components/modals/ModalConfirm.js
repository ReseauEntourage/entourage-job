import React from 'react';
import PropTypes from 'prop-types';

import ModalGeneric from 'src/components/modals/ModalGeneric';
import { Button, Grid } from 'src/components/utils';

const ModalConfirm = ({ id, onConfirm, text, buttonText }) => {
  return (
    <ModalGeneric id={id} classNameSize="uk-width-1-2@m">
      {(close) => {
        return (
          <>
            <p className="uk-text-center uk-text-lead">{text}</p>
            <Grid gap="small" center>
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
            </Grid>
          </>
        );
      }}
    </ModalGeneric>
  );
};
ModalConfirm.propTypes = {
  id: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default ModalConfirm;
