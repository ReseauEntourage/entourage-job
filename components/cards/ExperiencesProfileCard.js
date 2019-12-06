import React from 'react';
import PropTypes from 'prop-types';
import ModalEdit from '../modals/ModalEdit';
import schemaformEditExperience from '../forms/schema/formEditExperience';

function getExpWithSeparatedDates(exp) {
  const dateStartSplited = exp.dateStart.split('/');

  const newExp = {
    type: exp.type,
    title: exp.title,
    description: exp.description,
    'start-month': Number(dateStartSplited[0]),
    'start-year': Number(dateStartSplited[1]),
  };
  if (exp.dateEnd) {
    const [month, year] = exp.dateEnd.split('/').map((val) => Number(val));
    // on admet la date au bon format
    newExp['end-month'] = month;
    newExp['end-year'] = year;
  }
  return newExp;
}

function getExpWithoutSeparatedDate(exp) {
  return {
    type: exp.type,
    title: exp.title,
    description: exp.description,
    dateStart: `${exp['start-month']}/${exp['start-year']}`,
    dateEnd:
      exp['end-month'] && exp['end-year']
        ? `${exp['end-month']}/${exp['end-year']}`
        : undefined,
  };
}

// todo: ONE MODAL, MULTIPLE EDITION
const ExperiencesProfileCard = ({ experiences, onChange }) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <div className="uk-flex-inline uk-width-1-1">
        <h3 className="uk-card-title">
          Mon <span className="uk-text-primary">expérience</span>
        </h3>
        {onChange && (
          <h3 className="uk-card-title uk-align-right uk-text-right uk-width-expand">
            <ModalEdit
              id="modal-experience"
              button="plus"
              title="Ajout - Mon expérience"
              formSchema={schemaformEditExperience}
              onSubmit={(fields) =>
                onChange({
                  Experiences: [
                    ...experiences,
                    getExpWithoutSeparatedDate(fields),
                  ],
                })
              }
            />
          </h3>
        )}
      </div>

      {experiences.length !== 0 ? (
        <ul className="uk-list ent-list">
          {experiences.map((exp, i) => (
            <li id={i} key={i}>
              <div className="uk-text-muted uk-margin-small">
                <span>
                  {exp.dateEnd
                    ? `${exp.dateStart} - ${exp.dateEnd}`
                    : exp.dateStart}
                </span>
                <span className="uk-align-right uk-text-right">
                  <ModalEdit
                    // must use different id for each modal
                    id={`modal-experience-edit-${i}`}
                    title="Édition - Mon expérience"
                    formSchema={schemaformEditExperience}
                    defaultValues={getExpWithSeparatedDates(exp)}
                    onSubmit={(fields) => {
                      const newExperiences = experiences;
                      newExperiences[i] = getExpWithoutSeparatedDate(fields);
                      onChange({ Experiences: newExperiences });
                    }}
                  />
                </span>
              </div>
              <p className="uk-text-bold uk-text-primary uk-margin-small">
                {exp.title}
              </p>
              <p className="uk-margin-small-top uk-margin-medium-bottom">
                {exp.description}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="uk-text-italic">
          Aucune expérience n&apos;a encore été ajoutée
        </p>
      )}
    </div>
  );
};
ExperiencesProfileCard.propTypes = {
  experiences: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      dateStart: PropTypes.string,
      dateEnd: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
    })
  ),
  onChange: PropTypes.func,
};
ExperiencesProfileCard.defaultProps = {
  experiences: [],
  onChange: null,
};
export default ExperiencesProfileCard;
