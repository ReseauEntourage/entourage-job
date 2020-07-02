import UIkit from 'uikit';
import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from '../utils/Icon';
import ModalEdit from '../modals/ModalEdit';
import schemaformEditSkills from '../forms/schema/formEditSkills';
import ButtonIcon from '../utils/ButtonIcon';
import { GridNoSSR } from '../utils';

const SkillCard = ({ list, onChange }) => {
  return (
    <div className="uk-card uk-card-secondary uk-card-body">
      <GridNoSSR gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          {!onChange && (
            <span className="uk-margin-small-right">
              <IconNoSSR name="bolt" />
            </span>
          )}
          Mes atouts
        </h3>
        {onChange && (
          <ButtonIcon
            name="pencil"
            onClick={() => {
              UIkit.modal(`#modal-skills`).show();
            }}
          />
        )}
      </GridNoSSR>
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
      {onChange && (
        <ModalEdit
          id="modal-skills"
          title="Édition - Mes atouts (6 maximum)"
          formSchema={schemaformEditSkills}
          defaultValues={list.reduce((acc, value, i) => {
            acc[`skill${i + 1}`] = value;
            return acc;
          }, {})}
          onSubmit={(fields, closeModal) => {
            closeModal();
            const fieldsTransform = {
              skills: Object.values(fields).filter((val) => {
                return typeof val === 'string' && val !== '';
              }),
            };
            console.log(fields);
            onChange(fieldsTransform);
          }}
        />
      )}
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
