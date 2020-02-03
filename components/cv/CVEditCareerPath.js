/* global UIkit */
import React from 'react';
import PropTypes from 'prop-types';
import ModalEdit from '../modals/ModalEdit';
import schemaCareerPath from '../forms/schema/formEditCareerPath';
import ButtonIcon from '../utils/ButtonIcon';
import { GridNoSSR } from '../utils';

function generateContent(ambitions, careerPathOpen, gender) {
  if (ambitions.length === 0) {
    if (!careerPathOpen) {
      return (
        <p className="uk-text-italic">
          Aucun projet professionnel n&apos;a pas encore été créé.
        </p>
      );
    }
    if (careerPathOpen) {
      return (
        <p>
          Je reste {gender === 1 ? 'ouverte' : 'ouvert'} à toute autre
          proposition.
        </p>
      );
    }
  }
  return (
    <p>
      J&apos;aimerais beaucoup travailler dans{' '}
      <span className="uk-text-primary">{ambitions[0]}</span>
      {ambitions.length > 1 ? (
        <>
          {' '}
          ou dans <span className="uk-text-primary">{ambitions[1]}</span>
        </>
      ) : (
        ''
      )}
      {careerPathOpen
        ? ` mais reste ${gender === 1 ? 'ouverte' : 'ouvert'} à toute autre
          proposition.`
        : '.'}
    </p>
  );
}
const CVEditCareerPath = ({ ambitions, careerPathOpen, gender, onChange }) => (
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
      {generateContent(ambitions, careerPathOpen, gender)}
    </div>
    {onChange && (
      <ModalEdit
        id="modal-career-path"
        title="Édition - Projet professionnel"
        formSchema={schemaCareerPath}
        defaultValues={{
          careerPath0: ambitions.length > 0 ? ambitions[0] : null,
          careerPath1: ambitions.length > 1 ? ambitions[1] : null,
          careerPathOpen,
        }}
        onSubmit={({ careerPathOpen, careerPath0, careerPath1 }) => {
          onChange({
            ambitions: [careerPath0, careerPath1].filter((a) => a || null),
            careerPathOpen,
          });
        }}
      />
    )}
  </>
);
CVEditCareerPath.propTypes = {
  ambitions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
  gender: PropTypes.number,
  careerPathOpen: PropTypes.bool,
};
CVEditCareerPath.defaultProps = {
  onChange: null,
  gender: 0,
  careerPathOpen: true,
};
export default CVEditCareerPath;
