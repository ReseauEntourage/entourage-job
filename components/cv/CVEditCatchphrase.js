/* global UIkit */
import React from 'react';
import PropTypes from 'prop-types';
import ModalEdit from '../modals/ModalEdit';
import schemaCatchphrase from '../forms/schema/formEditCatchphrase';
import ButtonIcon from '../utils/ButtonIcon';
import { GridNoSSR } from '../utils';

const CVEditCatchphrase = ({ catchphrase, onChange }) => {
  return (
    <>
      <div className="uk-card uk-card-default uk-card-body">
        <GridNoSSR gap="small" between eachWidths={['expand', 'auto']}>
          <h3 className="uk-card-title">
            Ma <span className="uk-text-primary">phrase d&apos;accroche</span>
          </h3>
          {onChange && (
            <ButtonIcon
              name="pencil"
              onClick={() => {
                UIkit.modal(`#modal-catchphrase`).show();
              }}
            />
          )}
        </GridNoSSR>
        {catchphrase ? (
          <p>{catchphrase}</p>
        ) : (
          <p className="uk-text-italic">
            Aucune phrase d&apos;accroche n&apos;a encore été créé
          </p>
        )}
      </div>
      {onChange && (
        <ModalEdit
          id="modal-catchphrase"
          title="Édition - Ma phrase d'accroche"
          formSchema={schemaCatchphrase}
          defaultValues={{ catchphrase }}
          onSubmit={onChange}
        />
      )}
    </>
  );
};
CVEditCatchphrase.propTypes = {
  catchphrase: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};
CVEditCatchphrase.defaultProps = {
  onChange: null,
};
export default CVEditCatchphrase;
