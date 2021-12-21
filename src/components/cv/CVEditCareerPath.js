import React from 'react';
import PropTypes from 'prop-types';
import ModalEdit from 'src/components/modals/ModalEdit';
import schemaCareerPath from 'src/components/forms/schema/formEditCareerPath.json';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import { Grid } from 'src/components/utils';
import { openModal } from 'src/components/modals/Modal';

const CVEditCareerPath = ({ ambitions, careerPathOpen, onChange, gender }) => {
  const ContentByGender = () => {
    if (!ambitions || ambitions.length === 0) {
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
            Je reste {gender === 1 ? 'ouverte' : 'ouvert'} à toutes
            propositions.
          </p>
        );
      }
    }
    return (
      <p>
        J&apos;aimerais beaucoup travailler dans{' '}
        <span className="uk-text-primary">{ambitions[0]}</span>
        {ambitions && ambitions.length > 1 ? (
          <>
            {' '}
            ou dans <span className="uk-text-primary">{ambitions[1]}</span>
          </>
        ) : (
          ''
        )}
        {careerPathOpen
          ? ` mais reste ${gender === 1 ? 'ouverte' : 'ouvert'} à toutes autres
            propositions.`
          : '.'}
      </p>
    );
  };
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <Grid gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          Mon <span className="uk-text-primary">projet professionnel</span>
        </h3>
        {onChange && (
          <ButtonIcon
            name="pencil"
            onClick={() => {
              openModal(
                <ModalEdit
                  title="Édition - Projet professionnel"
                  formSchema={schemaCareerPath}
                  defaultValues={{
                    careerPath0:
                      ambitions && ambitions.length > 0 ? ambitions[0] : null,
                    careerPath1:
                      ambitions && ambitions.length > 1 ? ambitions[1] : null,
                    careerPathOpen,
                  }}
                  onSubmit={(
                    { careerPathOpen: isOpen, careerPath0, careerPath1 },
                    closeModal
                  ) => {
                    closeModal();
                    onChange({
                      ambitions: [careerPath0, careerPath1].filter((a) => {
                        return a || null;
                      }),
                      careerPathOpen: isOpen,
                    });
                  }}
                />
              );
            }}
          />
        )}
      </Grid>
      <ContentByGender />
    </div>
  );
};
CVEditCareerPath.propTypes = {
  ambitions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
  careerPathOpen: PropTypes.bool,
  gender: PropTypes.number.isRequired,
};
CVEditCareerPath.defaultProps = {
  onChange: null,
  careerPathOpen: true,
};
export default CVEditCareerPath;
