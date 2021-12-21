import React from 'react';
import PropTypes from 'prop-types';
import ModalEdit from 'src/components/modals/ModalEdit';
import schemaStory from 'src/components/forms/schema/formEditStory.json';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import { Grid } from 'src/components/utils';
import { formatParagraph } from 'src/utils';
import { openModal } from 'src/components/modals/Modal';

const StoryProfileCard = ({ description, onChange }) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <Grid gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          Mon <span className="uk-text-primary">histoire</span>
        </h3>
        {onChange && (
          <ButtonIcon
            name="pencil"
            onClick={() => {
              openModal(
                <ModalEdit
                  title="Édition - Mon histoire"
                  formSchema={schemaStory}
                  defaultValues={{ story: description }}
                  onSubmit={(fields, closeModal) => {
                    closeModal();
                    onChange({ ...fields });
                  }}
                />
              );
            }}
          />
        )}
      </Grid>

      {description ? (
        <p>{formatParagraph(description)}</p>
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
