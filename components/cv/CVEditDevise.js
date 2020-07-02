/* global UIkit */
import React from 'react';
import PropTypes from 'prop-types';
import ModalEdit from '../modals/ModalEdit';
import schemaDevise from '../forms/schema/formEditDevise';
import ButtonIcon from '../utils/ButtonIcon';
import { GridNoSSR } from '../utils';

const CVEditDevise = ({ devise, onChange }) => {
  return (
    <>
      <div className="uk-card uk-card-default uk-card-body">
        <GridNoSSR gap="small" between eachWidths={['expand', 'auto']}>
          <h3 className="uk-card-title">
            Ma <span className="uk-text-primary">devise</span>
          </h3>
          {onChange && (
            <ButtonIcon
              name="pencil"
              onClick={() => {
                UIkit.modal(`#modal-devise`).show();
              }}
            />
          )}
        </GridNoSSR>
        {devise ? (
          <p>{devise}</p>
        ) : (
          <p className="uk-text-italic">
            Aucune devise n&apos;a encore été créé
          </p>
        )}
      </div>
      {onChange && (
        <ModalEdit
          id="modal-devise"
          title="Édition - Ma devise"
          formSchema={schemaDevise}
          defaultValues={{ devise }}
          onSubmit={(fields, closeModal) => {
            closeModal();
            onChange(fields);
          }}
        />
      )}
    </>
  );
};
CVEditDevise.propTypes = {
  devise: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};
CVEditDevise.defaultProps = {
  onChange: null,
};
export default CVEditDevise;
