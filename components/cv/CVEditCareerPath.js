/* global UIkit */
import React from 'react';
import PropTypes from 'prop-types';
import ModalEdit from '../modals/ModalEdit';
import schemaCareerPath from '../forms/schema/formEditCareerPath';
import ButtonIcon from '../utils/ButtonIcon';
import { GridNoSSR } from '../utils';

const CVEditCareerPath = ({ careerPath0, careerPath1, onChange }) => {
  return (
    <>
      <div className="uk-card uk-card-default uk-card-body">
        <GridNoSSR gap="small" between eachWidths={['expand', 'auto']}>
          <h3 className="uk-card-title">
            Mon <span className="uk-text-primary">projet professionnel</span>
          </h3>
          {onChange && (
            <ButtonIcon
              name="pencil"
              onClick={() => UIkit.modal(`#modal-career-path`).show()}
            />
          )}
        </GridNoSSR>
        {careerPath0 ? (
          <p>
            J&apos;aimerais beaucoup travailler dans{' '}
            <span className="uk-text-primary">{careerPath0}</span>
            {careerPath1 ? (
              <span>
                <span> ou dans </span>
                <span className="uk-text-primary">{careerPath1}</span>
              </span>
            ) : (
              undefined
            )}{' '}
            mais reste ouvert à toute autre proposition.
          </p>
        ) : (
          <p className="uk-text-italic">
            Aucun projet professionnel n&apos;a pas encore été créé
          </p>
        )}
      </div>
      {onChange && (
        <ModalEdit
          id="modal-career-path"
          title="Édition - Projet professionnel"
          formSchema={schemaCareerPath}
          defaultValues={{ careerPath0, careerPath1 }}
          onSubmit={onChange}
        />
      )}
    </>
  );
};
CVEditCareerPath.propTypes = {
  careerPath0: PropTypes.string.isRequired,
  careerPath1: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};
CVEditCareerPath.defaultProps = {
  onChange: null,
};
export default CVEditCareerPath;
