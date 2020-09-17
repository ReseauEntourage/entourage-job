/* global UIkit */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ModalEdit from '../modals/ModalEdit';
import schemaCatchphrase from '../forms/schema/formEditCatchphrase';
import ButtonIcon from '../utils/ButtonIcon';
import { GridNoSSR } from '../utils';
import { ModalContext } from '../store/ModalProvider';

const CVEditCatchphrase = ({ catchphrase, onChange }) => {
  const { triggerModal } = useContext(ModalContext);

  return (
    <div className="uk-card uk-card-default uk-card-body">
      <GridNoSSR gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          Ma <span className="uk-text-primary">phrase d&apos;accroche</span>
        </h3>
        {onChange && (
          <ButtonIcon
            name="pencil"
            onClick={() => {
              triggerModal(`#modal-catchphrase`);
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
      {onChange && (
        <div>
          <ModalEdit
            id="modal-catchphrase"
            title="Édition - Ma phrase d'accroche"
            formSchema={schemaCatchphrase}
            defaultValues={{ catchphrase }}
            onSubmit={(fields, closeModal) => {
              closeModal();
              onChange(fields);
            }}
          />
        </div>
      )}
    </div>
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
