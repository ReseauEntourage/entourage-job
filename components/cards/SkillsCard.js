import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from '../utils/Icon';
import ModalEdit from '../modals/ModalEdit';
import schemaformEditSkills from '../forms/schema/formEditSkills';

const SkillCard = ({ list, onChange }) => {
  return (
    <div className="uk-card uk-card-secondary uk-card-body">
      <div className="uk-flex-inline uk-width-1-1">
        <h3 className="uk-card-title">
          {!onChange && (
            <span className="uk-margin-small-right">
              <IconNoSSR name="bolt" />
            </span>
          )}
          Mes atouts
        </h3>
        {onChange && (
          <h3 className="uk-card-title uk-align-right uk-text-right uk-width-expand uk-margin-remove">
            <ModalEdit
              id="modal-skills"
              title="Édition - Mes atouts (6 maximum)"
              formSchema={schemaformEditSkills}
              defaultValues={list.reduce((acc, value, i) => {
                acc[`skill${i + 1}`] = value;
                return acc;
              }, {})}
              onSubmit={(fields) => {
                const fieldsTransform = {
                  Skills: Object.values(fields).filter((val) => {
                    return typeof val === 'string' && val !== '';
                  }),
                };
                console.log(fields);
                onChange(fieldsTransform);
              }}
            />
          </h3>
        )}
      </div>
      <ul className="uk-list">
        {list.length !== 0 ? (
          list.map((item, i) => (
            <li id={i} key={i}>
              {item}
            </li>
          ))
        ) : (
          <li>Aucun atout renseigné</li>
        )}
      </ul>
    </div>
  );
};
SkillCard.propTypes = {
  list: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

SkillCard.defaultProps = {
  list: [],
  onChange: null,
};

export default SkillCard;
