/* global UIkit */
import React from 'react';
import PropTypes from 'prop-types';
import ModalEdit from '../modals/ModalEdit';
import schemaCareerPath from '../forms/schema/formEditCareerPath';
import ButtonIcon from '../utils/ButtonIcon';
import { GridNoSSR } from '../utils';

function generateContent(careerPath0, careerPath1, careerPathOpen, gender) {
  if (!careerPath0 && !careerPath1 && !careerPathOpen) {
    return (
      <p className="uk-text-italic">
        Aucun projet professionnel n&apos;a pas encore été créé.
      </p>
    );
  }
  if (!careerPath0 && !careerPath1 && careerPathOpen) {
    return (
      <p>
        Je reste {gender === 1 ? 'ouverte' : 'ouvert'} à toute autre
        proposition.
      </p>
    );
  }
  return (
    <p>
      J&apos;aimerais beaucoup travailler dans{' '}
      <span className="uk-text-primary">{careerPath0}</span>
      {careerPath1 ? (
        <>
          {' '}
          ou dans <span className="uk-text-primary">{careerPath1}</span>
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
const CVEditCareerPath = ({
  careerPath0,
  careerPath1,
  careerPathOpen,
  gender,
  onChange,
}) => (
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
      {generateContent(careerPath0, careerPath1, careerPathOpen, gender)}
    </div>
    {onChange && (
      <ModalEdit
        id="modal-career-path"
        title="Édition - Projet professionnel"
        formSchema={schemaCareerPath}
        defaultValues={{ careerPath0, careerPath1, careerPathOpen }}
        onSubmit={(aa) => {
          console.log(aa);
          debugger;
          onChange(aa);
        }}
      />
    )}
  </>
);
CVEditCareerPath.propTypes = {
  careerPath0: PropTypes.string.isRequired,
  careerPath1: PropTypes.string.isRequired,
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
