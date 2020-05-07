/* global UIkit */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ModalEdit from '../modals/ModalEdit';
import schemaformEditExperience from '../forms/schema/formEditExperience';
import { GridNoSSR } from '../utils';
import ButtonIcon from '../utils/ButtonIcon';
import ModalConfirm from '../modals/ModalConfirm';

// PROBLEM: les modals existe. mais ne sont pas present dans le dom react, resultat les evenements ne sont plus géré
// todo: ONE MODAL, MULTIPLE EDITION
const ExperiencesProfileCard = ({ experiences, onChange }) => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentDefaultValue, setCurrentDefaultValue] = useState({});
  console.log(experiences);

  return (
    <>
      <div className="uk-card uk-card-default uk-card-body">
        <GridNoSSR gap="small" between eachWidths={['expand', 'auto']}>
          <h3 className="uk-card-title">
            Mon <span className="uk-text-primary">expérience</span>
          </h3>
          {onChange && (
            <ButtonIcon
              onClick={() => UIkit.modal(`#modal-experience-add`).show()}
              name="plus"
            />
          )}
        </GridNoSSR>
        {/* trick pour ne pas avoir une erreur lors de la creation d'un nouveau noeud, voir l'edition des review */}
        <ul className={`uk-list${experiences.length > 0 ? ' ent-list' : ''}`}>
          {experiences.length <= 0 ? (
            <li className="uk-text-italic">
              Aucune expérience n&apos;a encore été ajoutée
            </li>
          ) : (
            experiences.map((exp, i) => (
              <li id={i} key={i}>
                <GridNoSSR
                  eachWidths={['expand', 'auto']}
                  className="uk-margin-medium-bottom"
                  style={{
                    overflowWrap: 'anywhere',
                  }}
                >
                  <>
                    <p className="uk-margin-small-top uk-margin-small">
                      {exp.description}
                    </p>
                    {exp.skills && (
                      <p className="uk-text-primary">
                        {exp.skills.map((name, key) => (
                          <span
                            key={key}
                            className="uk-label uk-margin-small-right"
                          >
                            {name}
                          </span>
                        ))}
                      </p>
                    )}
                  </>
                  {onChange && (
                    <div className="uk-flex uk-flex-column">
                      <ButtonIcon
                        name="pencil"
                        onClick={() => {
                          setCurrentIndex(i);
                          setCurrentDefaultValue(experiences[i]);
                          UIkit.modal(`#modal-experience-edit`).show();
                        }}
                      />
                      <ButtonIcon
                        name="trash"
                        onClick={() => {
                          setCurrentIndex(i);
                          UIkit.modal(`#modal-experience-remove`).show();
                        }}
                      />
                    </div>
                  )}
                </GridNoSSR>
              </li>
            ))
          )}
        </ul>
      </div>
      {onChange && (
        <>
          <ModalEdit
            id="modal-experience-add"
            title="Ajout - Mon expérience"
            formSchema={schemaformEditExperience}
            onSubmit={(fields, closeModal) => {
              closeModal();
              onChange({
                experiences: [...experiences, fields],
              })
            }}
          />
          <ModalEdit
            id="modal-experience-edit"
            title="Édition - Mon expérience"
            formSchema={schemaformEditExperience}
            defaultValues={currentDefaultValue}
            onSubmit={(fields, closeModal) => {
              closeModal();
              const newExperiences = experiences;
              newExperiences[currentIndex] = fields;
              onChange({ experiences: newExperiences });
            }}
          />
          <ModalConfirm
            id="modal-experience-remove"
            text="Êtes-vous sûr(e) de vouloir supprimer cette expérience ?"
            buttonText="supprimer"
            onConfirm={() => {
              experiences.splice(currentIndex, 1);
              onChange({ experiences });
            }}
          />
        </>
      )}
    </>
  );
};
ExperiencesProfileCard.propTypes = {
  experiences: PropTypes.arrayOf(
    PropTypes.shape({
      // type: PropTypes.string,
      // dateStart: PropTypes.string,
      // dateEnd: PropTypes.string,
      // title: PropTypes.string,
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

// const EditCard = ({ title, onChange, id, addCondition, content }) => (
//   <>
//   <div className="uk-card uk-card-default uk-card-body">
//     <GridNoSSR gap="small" between eachWidths={['expand', 'auto']}>
//       <h3 className="uk-card-title">{title}</h3>
//       {onChange && addCondition && (
//         <ButtonIcon onClick={() => UIkit.modal(`#${id}-add`).show()} name="plus" />
//       )}
//     </GridNoSSR>
//     {content}
//   </div>
//       {onChange && (
//         <>
//           <ModalEdit
//             id={`${id}-add`}
//             title={`Ajout - ${title}`}
//             formSchema={formSchema}
//             onSubmit={(fields) =>
//               onChange({
//                 Experiences: [
//                   ...experiences,
//                   getExpWithoutSeparatedDate(fields),
//                 ],
//               })
//             }
//           />
//           <ModalEdit
//             id="modal-experience-edit"
//             title="Édition - Mon expérience"
//             formSchema={formSchema}
//             defaultValues={currentDefaultValue}
//             onSubmit={(fields) => {
//               const newExperiences = experiences;
//               newExperiences[currentIndex] = getExpWithoutSeparatedDate(fields);
//               onChange({ Experiences: newExperiences });
//             }}
//           />
//           <ModalConfirm
//             id="modal-experience-remove"
//             text="Êtes-vous sûr(e) de vouloir supprimer cette expérience ?"
//             buttonText="supprimer"
//             onConfirm={() => {
//               experiences.splice(currentIndex, 1);
//               onChange({ Experiences: experiences });
//             }}
//           />
//         </>
//       )}

//   </>
// );
