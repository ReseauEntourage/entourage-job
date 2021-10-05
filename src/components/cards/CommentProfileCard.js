import React from 'react';
import PropTypes from 'prop-types';
import { Img } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon';

const CommentProfileCard = ({ name, title, description, imgSrc }) => {
  return (
    <article className="uk-comment uk-comment-primary">
      <div className="uk-grid-match" data-uk-grid>
        <div className="uk-text-primary">
          <IconNoSSR name="quote-right" ratio={1.4} />
        </div>
        <div className="uk-width-expand">
          <div className="uk-comment-body uk-margin-bottom">
            <p>{description}</p>
          </div>
          <div className="uk-width-expand">
            <h4 className="uk-comment-title uk-margin-remove">{name}</h4>
            <div className="uk-comment-meta  uk-margin-remove-top">
              <h5 className="uk-text-muted">{title}</h5>
            </div>
          </div>
        </div>
        <div className="uk-comment-header uk-grid-medium uk-flex-bottom">
          <div className="uk-width-auto">
            <Img
              className="uk-comment-avatar"
              src={imgSrc}
              width={80}
              height={80}
              alt={`image de ${name}`}
            />
          </div>
        </div>
      </div>
    </article>
  );
};
CommentProfileCard.propTypes = {
  description: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  imgSrc: PropTypes.string.isRequired,
};
export default CommentProfileCard;
