import React from 'react';
import PropTypes from 'prop-types';
import ModalEdit from 'src/components/modals/ModalEdit';
import schemaCatchphrase from 'src/components/forms/schema/formEditCatchphrase.json';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import { Grid } from 'src/components/utils';
import { openModal } from 'src/components/modals/Modal';

const CVEditCatchphrase = ({ catchphrase, onChange }) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <Grid gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          Ma <span className="uk-text-primary">phrase d&apos;accroche</span>
        </h3>
        {onChange && (
          <ButtonIcon
            name="pencil"
            onClick={() => {
              openModal(
                <ModalEdit
                  title="Édition - Ma phrase d'accroche"
                  formSchema={schemaCatchphrase}
                  defaultValues={{ catchphrase }}
                  onSubmit={(fields, closeModal) => {
                    closeModal();
                    onChange({
                      ...fields,
                    });
                  }}
                />
              );
            }}
          />
        )}
      </Grid>
      {catchphrase ? (
        <p>{catchphrase}</p>
      ) : (
        <p className="uk-text-italic">
          Aucune phrase d&apos;accroche n&apos;a encore été créé
        </p>
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
