import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from '../utils/Icon';
import ModalEdit from '../modals/ModalEdit';
import schemaformEditPassions from '../forms/schema/formEditPassions';

const PassionsCard = ({ list, onChange }) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <div className="uk-flex-inline uk-width-1-1">
        <h3 className="uk-card-title">
          {!onChange && (
            <span className="uk-margin-small-right">
              <IconNoSSR name="heart" />
            </span>
          )}
          Mes passions
        </h3>
        {onChange && (
          <h3 className="uk-card-title uk-align-right uk-text-right uk-width-expand uk-margin-remove">
            <ModalEdit
              id="modal-passions"
              title="Edition - mes passions (6 maximum)"
              formSchema={schemaformEditPassions}
              defaultValues={list}
              onSubmit={onChange}
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
          <li>Aucune passion renseignée</li>
        )}
      </ul>
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
