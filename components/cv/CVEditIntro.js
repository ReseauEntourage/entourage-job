import React from 'react';
import PropTypes from 'prop-types';
import ModalEdit from '../modals/ModalEdit';
import schemaCatchphrase from '../forms/schema/formEditCatchphrase';

const CVEditIntro = ({ intro, onChange }) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <div className="uk-flex-inline uk-width-1-1">
        <h3 className="uk-card-title">
          <span className="uk-text-bold">
            Description - Phrase d&apos;accroche
          </span>
          <br />
          (x caractères max)
        </h3>
        {onChange && (
          <h3 className="uk-card-title uk-align-right uk-text-right uk-width-expand">
            <ModalEdit
              id="modal-catchphrase"
              title="Édition - Ma phrase d'accroche"
              formSchema={schemaCatchphrase}
              defaultValues={[intro]}
              onSubmit={onChange}
            />
          </h3>
        )}
      </div>
      {intro ? (
        <p>{intro}</p>
      ) : (
        <p className="uk-text-italic">
          Aucune phrase d&apos;accroche n&apos;a encore été créé
        </p>
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
