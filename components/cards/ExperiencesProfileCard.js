import React from 'react';
import PropTypes from 'prop-types';
import ModalEdit from '../modals/ModalEdit';
import schemaformEditExperience from '../forms/schema/formEditExperience';
import ModalGeneric from '../modals/ModalGeneric';
import { Button, IconNoSSR, GridNoSSR, CloseButtonNoSSR } from '../utils';

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

// PROPBLEM: les modals existe. mais ne sont pas present dans le dom react, resultat les evenements ne sont plus géré
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
              // defaultValues={{
              //   type: 1,
              //   title: 'La dégustation de chocolat',
              //   description: 'Le sport',
              //   'start-month': 2,
              //   'start-year': 1999,
              // }}
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
              <div className="uk-child-width-auto" data-uk-grid>
                <div className="uk-width-expand">
                  <div className="uk-text-muted uk-margin-small">
                    <span>
                      {exp.dateEnd
                        ? `${exp.dateStart} - ${exp.dateEnd}`
                        : exp.dateStart}
                    </span>
                  </div>
                  <p className="uk-text-bold uk-text-primary uk-margin-small">
                    {exp.title}
                  </p>
                  <p className="uk-margin-small-top uk-margin-medium-bottom">
                    {exp.description}
                  </p>
                </div>
                <div className="uk-flex uk-flex-column">
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
                  <Button
                    style="text"
                    toggle={`target: #modal-experience-remove-${i}`}
                  >
                    <IconNoSSR name="trash" ratio={1.5} />
                  </Button>
                  <ModalGeneric
                    classNameSize="uk-width-1-2@m"
                    id={`modal-experience-remove-${i}`}
                  >
                    {(close) => (
                      <div>
                        <CloseButtonNoSSR className="uk-modal-close-default" />
                        <p className="uk-text-center uk-text-lead">
                          Êtes-vous sûr(e) de vouloir supprimer cette expérience
                          ?
                        </p>
                        <GridNoSSR
                          center
                          className="uk-grid-small"
                          items={[
                            <Button style="default" onClick={() => close()}>
                              Annuler
                            </Button>,
                            <Button
                              style="primary"
                              onClick={() => {
                                close();
                                experiences.splice(i, 1);
                                onChange({ Experiences: experiences });
                              }}
                            >
                              Supprimer
                            </Button>,
                          ]}
                        />
                      </div>
                    )}
                  </ModalGeneric>
                </div>
              </div>
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
