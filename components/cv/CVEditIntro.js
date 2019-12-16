/* global UIkit */
import React from 'react';
import PropTypes from 'prop-types';
import ModalEdit from '../modals/ModalEdit';
import schemaCatchphrase from '../forms/schema/formEditCatchphrase';
import ButtonIcon from '../utils/ButtonIcon';
import { GridNoSSR } from '../utils';

const CVEditIntro = ({ intro, onChange }) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <GridNoSSR gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title uk-text-bold">
          Description - Phrase d&apos;accroche
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
      {intro ? (
        <p>{intro}</p>
      ) : (
        <p className="uk-text-italic">
          Aucune phrase d&apos;accroche n&apos;a encore été créé
        </p>
      )}
      {onChange && (
        <ModalEdit
          id="modal-catchphrase"
          title="Édition - Ma phrase d'accroche"
          formSchema={schemaCatchphrase}
          defaultValues={{ intro }}
          onSubmit={onChange}
        />
      )}
    </div>
  );
};
CVEditIntro.propTypes = {
  intro: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};
CVEditIntro.defaultProps = {
  onChange: null,
};
export default CVEditIntro;
