/* global UIkit */
import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from '../utils/Icon';
import ModalEdit from '../modals/ModalEdit';
import schemaformEditPassions from '../forms/schema/formEditPassions';
import ButtonIcon from '../utils/ButtonIcon';
import { GridNoSSR } from '../utils';

const PassionsCard = ({ list, onChange }) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <GridNoSSR gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          {!onChange && (
            <span className="uk-margin-small-right">
              <IconNoSSR name="heart" />
            </span>
          )}
          Mes passions
        </h3>
        {onChange && (
          <ButtonIcon
            name="pencil"
            onClick={() => {
              UIkit.modal(`#modal-passions`).show();
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
          <li>Aucune passion renseignée</li>
        )}
      </ul>
      {onChange && (
        <h3 className="uk-card-title uk-align-right uk-text-right uk-width-expand uk-margin-remove">
          <ModalEdit
            id="modal-passions"
            title="Édition - Mes passions (6 maximum)"
            formSchema={schemaformEditPassions}
            defaultValues={list.reduce((acc, value, i) => {
              acc[`passion${i + 1}`] = value;
              return acc;
            }, {})}
            onSubmit={(fields) => {
              const fieldsTransform = {
                passions: Object.values(fields).filter((val) => {
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
  );
};
PassionsCard.propTypes = {
  list: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};
PassionsCard.defaultProps = {
  list: [],
  onChange: null,
};
export default PassionsCard;
