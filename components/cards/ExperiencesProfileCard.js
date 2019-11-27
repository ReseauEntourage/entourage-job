import React from 'react';
import PropTypes from 'prop-types';
import ModalEdit from '../modals/ModalEdit';
import schemaformEditExperience from '../forms/schema/formEditExperience';

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
              title="Édition - Mon expérience"
              formSchema={schemaformEditExperience}
              defaultValues={[
                'Formation',
                'CACES 3',
                'test',
                [2, 1999],
                [3, 2000],
              ]}
              onSubmit={(fields) => {
                const fieldsTransform = { ...fields };
                fieldsTransform.dateStart = `${fields['start-month']} / ${
                  fields['start-year']
                }`;
                fieldsTransform.dateEnd = `${fields['end-month']} / ${
                  fields['end-year']
                }`;
                delete fieldsTransform['start-month'];
                delete fieldsTransform['start-year'];
                delete fieldsTransform['end-month'];
                delete fieldsTransform['end-year'];
                console.log(fields);
                console.log(fieldsTransform);
                onChange({ Experiences: [fieldsTransform] });
              }}
            />
          </h3>
        )}
      </div>

      {experiences.length !== 0 ? (
        <ul className="uk-list ent-list">
          {experiences.map((item, i) => (
            <li id={i} key={i}>
              <p className="uk-text-muted uk-margin-small">
                {item.dateStart} - {item.dateEnd}
              </p>
              <p className="uk-text-bold uk-text-primary uk-margin-small">
                {item.title}
              </p>
              <p className="uk-margin-small-top uk-margin-medium-bottom">
                {item.description}
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
