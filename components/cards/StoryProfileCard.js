import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from '../utils';
import ModalEdit from '../modals/ModalEdit';
import schemaStory from '../forms/schema/formEditStory';

const StoryProfileCard = ({ description, onChange }) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <div className="uk-flex-inline uk-width-1-1">
        <h3 className="uk-card-title">
          Mon <span className="uk-text-primary">histoire</span>
        </h3>
        {onChange && (
          <h3 className="uk-card-title uk-align-right uk-text-right uk-width-expand">
            <ModalEdit
              id="modal-story"
              title="Édition - Mon histoire"
              formSchema={schemaStory}
              defaultValues={{ story: description }}
              onSubmit={onChange}
            />
          </h3>
        )}
      </div>

      {description ? (
        <p>{description}</p>
      ) : (
        <p className="uk-text-italic">
          Aucune histoire n&apos;a encore été ajoutée
        </p>
      )}
    </div>
  );
};
StoryProfileCard.propTypes = {
  description: PropTypes.string,
  onChange: PropTypes.func,
};
StoryProfileCard.defaultProps = {
  description: '',
  onChange: null,
};
export default StoryProfileCard;
