import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
import { IconNoSSR } from '../utils/Icon';
import ModalContactCandidat from '../modals/ModalContactCandidat';

const CVPresentationCard = ({ firstName, intro, userId }) => {
  const hashtags = ['LinkedOut'];
  const sharedDescription =
    "Lorsque l'on est exclu, les chances de trouver du travail sont proches de zéro. Avec LinkedOut, faites don de votre visibilité. Un partage peut tout changer.";
  const firstNameCapitalized =
    firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  const title = `${firstNameCapitalized} - Entourage Jobs`;
  const router = useRouter();
  const hostname = process.env.SERVER_URL;
  const link = `${hostname}${router.asPath}`;

  return (
    <div className="uk-card uk-card-default uk-card-body uk-text-center uk-margin-medium ">
      <h1 className="uk-width-xxlarge uk-margin-auto">
        <span className="uk-text-uppercase uk-text-primary">
          {firstNameCapitalized}
        </span>
        <br /> a besoin d&apos;un coup de pouce et si votre partage faisait la
        différence?
      </h1>
      <span className="uk-text-primary">
        <IconNoSSR name="quote-right" ratio={2} />
      </span>
      <p className="uk-width-xlarge uk-margin-auto">{intro}</p>
      <button
        type="button"
        className="uk-button uk-button-primary"
        data-uk-toggle="target: #modalContactCandidat"
      >
        J&apos;écris à {firstNameCapitalized}
      </button>
      <ModalContactCandidat candidat={{ id: userId, firstName }} />
      <p>partagez le CV de {firstNameCapitalized} sur vos réseaux</p>
      <div className="uk-flex uk-flex-row uk-flex-center">
        <LinkedinShareButton
          url={link}
          title={title}
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
  firstName: PropTypes.string.isRequired,
  intro: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default CVPresentationCard;
