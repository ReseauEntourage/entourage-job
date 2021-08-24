/* global UIkit */
import React from 'react';
import PropTypes from 'prop-types';
import ModalEdit from 'src/components/modals/ModalEdit';
import schemaStory from 'src/components/forms/schema/formEditStory.json';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import { GridNoSSR } from 'src/components/utils';
import { formatParagraph } from 'src/utils';

const StoryProfileCard = ({ description, onChange }) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <GridNoSSR gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          Mon <span className="uk-text-primary">histoire</span>
        </h3>
        {onChange && (
          <ButtonIcon
            name="pencil"
            onClick={() => {
              UIkit.modal(`#modal-story`).show();
            }}
          />
        )}
      </GridNoSSR>

      {description ? (
        <p>{formatParagraph(description)}</p>
      ) : (
        <p className="uk-text-italic">
          Aucune histoire n&apos;a encore été ajoutée
        </p>
      )}
      {onChange && (
        <h3 className="uk-card-title uk-align-right uk-text-right uk-width-expand">
          <ModalEdit
            id="modal-story"
            title="Édition - Mon histoire"
            formSchema={schemaStory}
            defaultValues={{ story: description }}
            onSubmit={(fields, closeModal) => {
              closeModal();
              onChange({ ...fields });
            }}
          />
        </h3>
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
