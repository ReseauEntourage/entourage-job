import React from 'react';
import PropTypes from 'prop-types';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from 'react-share';
import { IconNoSSR } from '../utils/Icon';
import { Button } from '../utils';

const CVPresentationCard = ({ name, description, link }) => (
  <div
    className="uk-card uk-card-default uk-card-body uk-text-center uk-margin-medium "
    style={{ marginTop: '400px' }}
  >
    <h1 className="uk-width-xxlarge uk-margin-auto">
      <span className="uk-text-uppercase uk-text-primary">{name}</span>
      <br /> a besoin d'un coup de pouce et si votre partage faisait la
      différence?
    </h1>
    <span className="uk-text-primary">
      <IconNoSSR name="quote-right" ratio={2} />
    </span>
    <p className="uk-width-xlarge uk-margin-auto">{description}</p>
    <Button href="#" style="primary">
      J'écris à {name}
    </Button>
    <p>partagez le CV de {name} sur vos réseaux</p>
    <div className="uk-flex uk-flex-row uk-flex-center">
      <LinkedinShareButton
        url={link}
        className="uk-icon-link uk-text-primary uk-margin-right"
      >
        <IconNoSSR name="linkedin" ratio={1.5} />
      </LinkedinShareButton>
      <FacebookShareButton
        url={link}
        className="uk-icon-link uk-text-primary uk-margin-right"
      >
        <IconNoSSR name="facebook" ratio={1.5} />
      </FacebookShareButton>
      <TwitterShareButton url={link} className="uk-icon-link uk-text-primary">
        <IconNoSSR name="twitter" ratio={1.5} />
      </TwitterShareButton>
    </div>
  </div>
);
CVPresentationCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.element.isRequired,
  link: PropTypes.string.isRequired,
};

export default CVPresentationCard;
