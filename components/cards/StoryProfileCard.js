/* global UIkit */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ModalEdit from '../modals/ModalEdit';
import schemaStory from '../forms/schema/formEditStory.json';
import ButtonIcon from '../utils/ButtonIcon';
import { GridNoSSR } from '../utils';
import { formatParagraph } from "../../utils";
import { ModalContext } from '../store/ModalProvider';

const StoryProfileCard = ({ description, onChange }) => {
  const { triggerModal } = useContext(ModalContext);

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
              triggerModal(`#modal-story`);
            }}
          />
        )}
      </GridNoSSR>

      {description ?
        <p>
          {formatParagraph(description)}
        </p>
        :
        <p className="uk-text-italic">
          Aucune histoire n&apos;a encore été ajoutée
      </p>
      }
      {onChange && (
        <h3 className="uk-card-title uk-align-right uk-text-right uk-width-expand">
          <ModalEdit
            id="modal-story"
            title="Édition - Mon histoire"
            formSchema={schemaStory}
            defaultValues={{ story: description }}
            onSubmit={(fields, closeModal) => {
              closeModal();
              onChange(fields);
            }}
          />
        </h3>
      )}
    </div>
  )
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
