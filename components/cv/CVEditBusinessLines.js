/* global UIkit */
/* eslint-disable jsx-a11y/aria-role */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR } from '../utils/Grid';
import { IconNoSSR } from '../utils';
import ButtonIcon from '../utils/ButtonIcon';
import ModalEdit from '../modals/ModalEdit';
import schemaEditCVBusinessLines from '../forms/schema/formEditCVBusinessLines';
import { ModalContext } from '../store/ModalProvider';

const CVEditBusinessLines = ({ businessLines, onChange }) => {
  const { triggerModal } = useContext(ModalContext);

  return (
    <div className="uk-card uk-card-default uk-card-body">
      <GridNoSSR between gap="medium" eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          {!onChange && (
            <span className="uk-margin-small-right">
              <IconNoSSR name="info" />
            </span>
          )}
        Mes <span className="uk-text-primary">secteurs d&apos;activité</span>
        </h3>
        {onChange && (
          <ButtonIcon
            name="pencil"
            onClick={() => {
              triggerModal(`#modal-cv-businesslines`);
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
            <p className="uk-text-italic">Aucun secteur d&apos;activité renseigné</p>
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
  )
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
