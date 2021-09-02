/* global UIkit */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

import ModalEdit from 'src/components/modals/ModalEdit';
import schemaformEditExperience from 'src/components/forms/schema/formEditExperience.json';
import { Grid } from 'src/components/utils';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import ModalConfirm from 'src/components/modals/ModalConfirm';
import { formatParagraph, sortExperiences } from 'src/utils';

const Experience = SortableElement(
  ({ value, sortIndex, onChange, setCurrentIndex, setCurrentDefaultValue }) => {
    return (
      <li style={{ cursor: 'move', listStyleType: 'none' }}>
        <Grid
          eachWidths={['expand', 'auto']}
          className="uk-margin-medium-bottom"
          style={{
            overflowWrap: 'anywhere',
          }}
        >
          <>
            <p className="uk-margin-small-top uk-margin-small">
              {formatParagraph(value.description)}
            </p>
            {value.skills && (
              <p className="uk-text-primary">
                {value.skills.map((name, key) => {
                  return (
                    <span key={key} className="uk-label uk-margin-small-right">
                      {name}
                    </span>
                  );
                })}
              </p>
            )}
          </>
          {onChange && (
            <div className="uk-flex uk-flex-column">
              <ButtonIcon
                name="pencil"
                onClick={() => {
                  setCurrentIndex(sortIndex);
                  setCurrentDefaultValue(value);
                  UIkit.modal(`#modal-experience-edit`).show();
                }}
              />
              <ButtonIcon
                name="trash"
                onClick={() => {
                  setCurrentIndex(sortIndex);
                  UIkit.modal(`#modal-experience-remove`).show();
                }}
              />
            </div>
          )}
        </Grid>
      </li>
    );
  }
);

const ExperienceList = SortableContainer(
  ({ items, onChange, setCurrentIndex, setCurrentDefaultValue }) => {
    return (
      <ul
        id="experiences"
        className={`uk-list${items.length > 0 ? ' ent-list' : ''}`}
      >
        {items.length <= 0 ? (
          <li className="uk-text-italic">
            Aucune expérience n&apos;a encore été ajoutée
          </li>
        ) : (
          items.map((value, index) => {
            return (
              <Experience
                key={`item-${index}`}
                index={index}
                sortIndex={index}
                value={value}
                onChange={onChange}
                setCurrentIndex={setCurrentIndex}
                setCurrentDefaultValue={setCurrentDefaultValue}
              />
            );
          })
        )}
      </ul>
    );
  }
);

const ExperiencesProfileCard = ({ experiences, onChange }) => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentDefaultValue, setCurrentDefaultValue] = useState({});

  const sortedExperiences = sortExperiences(experiences);

  const updateExperiencesOrder = (reorderedExperiences) => {
    const newExperiencesList = [];
    for (let i = 0; i < reorderedExperiences.length; i += 1) {
      newExperiencesList.push({
        ...reorderedExperiences[i],
        order: i,
      });
    }

    onChange({
      experiences: [...newExperiencesList],
    });
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const reorderedExperiences = arrayMove(
      sortedExperiences,
      oldIndex,
      newIndex
    );
    updateExperiencesOrder(reorderedExperiences);
  };

  return (
    <>
      <div className="uk-card uk-card-default uk-card-body">
        <Grid gap="small" between eachWidths={['expand', 'auto']}>
          <h3 className="uk-card-title">
            Mes <span className="uk-text-primary">expériences</span> et{' '}
            <span className="uk-text-primary">compétences</span>
          </h3>
          {onChange && (
            <ButtonIcon
              onClick={() => {
                return UIkit.modal(`#modal-experience-add`).show();
              }}
              name="plus"
            />
          )}
        </Grid>
        <ExperienceList
          pressDelay={200}
          items={sortedExperiences}
          onSortEnd={onSortEnd}
          onChange={onChange}
          setCurrentIndex={setCurrentIndex}
          setCurrentDefaultValue={setCurrentDefaultValue}
        />
      </div>
      {onChange && (
        <div>
          <div>
            <ModalEdit
              id="modal-experience-add"
              title="Ajout - Mes expériences et compétences"
              formSchema={schemaformEditExperience}
              onSubmit={(fields, closeModal) => {
                closeModal();
                onChange({
                  experiences: [
                    ...sortedExperiences,
                    {
                      ...fields,
                      order:
                        experiences.reduce((acc, val) => {
                          return acc === undefined || val.order > acc
                            ? val.order
                            : acc;
                        }, []) + 1,
                    },
                  ],
                });
              }}
            />
          </div>
          <div>
            <ModalEdit
              id="modal-experience-edit"
              title="Édition - Mes expériences et compétences"
              formSchema={schemaformEditExperience}
              defaultValues={currentDefaultValue}
              onSubmit={(fields, closeModal) => {
                closeModal();
                sortedExperiences[currentIndex] = fields;
                onChange({ experiences: sortedExperiences });
              }}
            />
          </div>
          <div>
            <ModalConfirm
              id="modal-experience-remove"
              text="Êtes-vous sûr(e) de vouloir supprimer cette expérience ?"
              buttonText="Supprimer"
              onConfirm={() => {
                sortedExperiences.splice(currentIndex, 1);
                updateExperiencesOrder(sortedExperiences);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

ExperiencesProfileCard.propTypes = {
  experiences: PropTypes.arrayOf(
    PropTypes.shape({
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
