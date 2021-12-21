import React from 'react';
import PropTypes from 'prop-types';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

import ModalEdit from 'src/components/modals/ModalEdit';
import schemaformEditExperience from 'src/components/forms/schema/formEditExperience.json';
import { Grid } from 'src/components/utils';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import ModalConfirm from 'src/components/modals/ModalConfirm';
import { formatParagraph, sortExperiences } from 'src/utils';
import { openModal } from 'src/components/modals/Modal';

const Experience = SortableElement(
  ({ value, sortIndex, items, onChange, updateOrder }) => {
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
                  openModal(
                    <ModalEdit
                      title="Édition - Mes expériences et compétences"
                      formSchema={schemaformEditExperience}
                      defaultValues={value}
                      onSubmit={(fields, closeModal) => {
                        closeModal();
                        items[sortIndex] = {
                          ...items[sortIndex],
                          ...fields,
                        };
                        onChange({ experiences: items });
                      }}
                    />
                  );
                }}
              />
              <ButtonIcon
                name="trash"
                onClick={() => {
                  openModal(
                    <ModalConfirm
                      text="Êtes-vous sûr(e) de vouloir supprimer cette expérience ?"
                      buttonText="Supprimer"
                      onConfirm={() => {
                        const experiencesToSort = [...items];
                        experiencesToSort.splice(sortIndex, 1);
                        updateOrder(experiencesToSort);
                      }}
                    />
                  );
                }}
              />
            </div>
          )}
        </Grid>
      </li>
    );
  }
);

const ExperienceList = SortableContainer(({ items, onChange, updateOrder }) => {
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
              updateOrder={updateOrder}
              items={items}
            />
          );
        })
      )}
    </ul>
  );
});

const ExperiencesProfileCard = ({ experiences, onChange }) => {
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
    <div className="uk-card uk-card-default uk-card-body">
      <Grid gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          Mes <span className="uk-text-primary">expériences</span> et{' '}
          <span className="uk-text-primary">compétences</span>
        </h3>
        {onChange && (
          <ButtonIcon
            onClick={() => {
              openModal(
                <ModalEdit
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
              );
            }}
            name="plus"
          />
        )}
      </Grid>
      <ExperienceList
        pressDelay={150}
        items={sortedExperiences}
        onSortEnd={onSortEnd}
        onChange={onChange}
        updateOrder={updateExperiencesOrder}
      />
    </div>
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
