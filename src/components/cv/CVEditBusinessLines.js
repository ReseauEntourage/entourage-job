/* global UIkit */

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Icon } from 'src/components/utils/';

import ButtonIcon from 'src/components/utils/ButtonIcon';
import ModalEdit from 'src/components/modals/ModalEdit';
import schemaEditCVBusinessLines from 'src/components/forms/schema/formEditCVBusinessLines';

const CVEditBusinessLines = ({ businessLines, onChange }) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <Grid between gap="medium" eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          {!onChange && (
            <span className="uk-margin-small-right">
              <Icon name="info" />
            </span>
          )}
          Mes <span className="uk-text-primary">secteurs d&apos;activité</span>
        </h3>
        {onChange && (
          <ButtonIcon
            name="pencil"
            onClick={() => {
              UIkit.modal(`#modal-cv-businesslines`).show();
            }}
          />
        )}
      </Grid>
      <p>
        {businessLines && businessLines.length > 0 ? (
          businessLines.map((t, key) => {
            return (
              <span key={key} className="uk-label uk-margin-small-right">
                {t}
              </span>
            );
          })
        ) : (
          <p className="uk-text-italic">
            Aucun secteur d&apos;activité renseigné
          </p>
        )}
      </p>
      {onChange && (
        <div>
          <ModalEdit
            id="modal-cv-businesslines"
            title="Édition - Secteurs d'activité"
            formSchema={schemaEditCVBusinessLines}
            defaultValues={{
              businessLines,
            }}
            description="Ces valeurs ne seront pas affichées sur le CV mais serviront aux recruteurs à filtrer les candidats."
            onSubmit={(fields, closeModal) => {
              closeModal();
              onChange({
                ...fields,
              });
            }}
          />
        </div>
      )}
    </div>
  );
};
CVEditBusinessLines.propTypes = {
  businessLines: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

CVEditBusinessLines.defaultProps = {
  businessLines: [],
  onChange: null,
};
export default CVEditBusinessLines;