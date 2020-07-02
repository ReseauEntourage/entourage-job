import UIkit from 'uikit';
/* eslint-disable jsx-a11y/aria-role */
import React from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR } from '../utils/Grid';
import { IconNoSSR } from '../utils';
import ButtonIcon from '../utils/ButtonIcon';
import ModalEdit from '../modals/ModalEdit';
import schemaEditCVBusinessLines from '../forms/schema/formEditCVBusinessLines.json';

const CVEditBusinessLines = ({ businessLines, onChange }) => (
  <div className="uk-card uk-card-default uk-card-body">
    <GridNoSSR between gap="medium" eachWidths={['expand', 'auto']}>
      <h3 className="uk-card-title">
        {!onChange && (
          <span className="uk-margin-small-right">
            <IconNoSSR name="info" />
          </span>
        )}
        Mes <span className="uk-text-primary">mots clés</span>
      </h3>
      {onChange && (
        <ButtonIcon
          name="pencil"
          onClick={() => {
            UIkit.modal(`#modal-cv-businesslines`).show();
          }}
        />
      )}
    </GridNoSSR>
    <p>
      {businessLines.length > 0 ? (
        businessLines.map((t, key) => (
          <span key={key} className="uk-label uk-margin-small-right">
            {t}
          </span>
        ))
      ) : (
        <p className="uk-text-italic">Aucun mots clés non renseignées</p>
      )}
    </p>
    {onChange && (
      <ModalEdit
        id="modal-cv-businesslines"
        title="Édition - Mots clés"
        formSchema={schemaEditCVBusinessLines}
        defaultValues={{
          businessLines,
        }}
        onSubmit={(fields, closeModal) => {
          closeModal();
          onChange({
            ...fields,
          });
        }}
      />
    )}
  </div>
);
CVEditBusinessLines.propTypes = {
  businessLines: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

CVEditBusinessLines.defaultProps = {
  businessLines: [],
  onChange: null,
};
export default CVEditBusinessLines;
