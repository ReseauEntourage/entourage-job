import React from 'react';
import PropTypes from 'prop-types';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
import { IconNoSSR } from '../utils/Icon';
import { Button } from '../utils';
import ModalContactCandidat from '../modals/ModalContactCandidat';

const CVPresentationCard = ({
  name,
  description,
  link,
  email,
  hashtags,
  sharedTitle,
  sharedDescription,
}) => {
  return (
    <div className="uk-card uk-card-default uk-card-body uk-text-center uk-margin-medium ">
      <h1 className="uk-width-xxlarge uk-margin-auto">
        <span className="uk-text-uppercase uk-text-primary">{name}</span>
        <br /> a besoin d'un coup de pouce et si votre partage faisait la
        différence?
      </h1>
      <span className="uk-text-primary">
        <IconNoSSR name="quote-right" ratio={2} />
      </span>
      <p className="uk-width-xlarge uk-margin-auto">{description}</p>
      <button
        type="button"
        className="uk-button uk-button-primary"
        data-uk-toggle="target: #modalContactCandidat"
      >
        J&apos;écris à {name}
      </button>
      <ModalContactCandidat candidat={{ id: '222', firstName: name }} />
      <p>partagez le CV de {name} sur vos réseaux</p>
      <div className="uk-flex uk-flex-row uk-flex-center">
        <LinkedinShareButton
          url={link}
          title={sharedTitle}
          description={sharedDescription}
          style={{ cursor: 'pointer' }}
          className="uk-icon-link uk-text-primary uk-margin-right"
        >
          <IconNoSSR name="linkedin" ratio={1.5} />
        </LinkedinShareButton>
        <FacebookShareButton
          url={link}
          quote={sharedDescription}
          hashtags={hashtags}
          style={{ cursor: 'pointer' }}
          className="uk-icon-link uk-text-primary uk-margin-right"
        >
          <IconNoSSR name="facebook" ratio={1.5} />
        </FacebookShareButton>
        <TwitterShareButton
          url={link}
          title={sharedDescription}
          hashtags={hashtags}
          via="R_Entourage"
          style={{ cursor: 'pointer' }}
          className="uk-icon-link uk-text-primary primary uk-margin-right"
        >
          <IconNoSSR name="twitter" ratio={1.5} />
        </TwitterShareButton>
        <WhatsappShareButton
          url={link}
          title={sharedDescription}
          style={{ cursor: 'pointer' }}
          className="uk-icon-link uk-text-primary"
        >
          <IconNoSSR name="whatsapp" ratio={1.5} />
        </WhatsappShareButton>
      </div>
    </div>
  );
};
CVPresentationCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.element.isRequired,
  link: PropTypes.string.isRequired,
  email: PropTypes.string,
  hashtags: PropTypes.arrayOf(PropTypes.string),
  sharedTitle: PropTypes.string,
  sharedDescription: PropTypes.string,
};
CVPresentationCard.defaultProps = {
  email: undefined,
  hashtags: [],
  sharedTitle: undefined,
  sharedDescription: undefined,
};

export default CVPresentationCard;
