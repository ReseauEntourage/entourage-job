/* global UIkit */
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
import ModalEdit from '../modals/ModalEdit';
import schema from '../forms/schema/formEditOpportunity';
import Axios from '../../Axios';
import ModalShareCV from '../modals/ModalShareCV';

const CVPresentationCard = ({ firstName, intro, userId }) => {
  const hashtags = ['LinkedOut'];
  const sharedDescription =
    "Lorsque l'on est exclu, les chances de trouver du travail sont proches de zéro. Avec LinkedOut, faites don de votre visibilité. Un partage peut tout changer.";
  const title = `${firstName} - Entourage Jobs`;
  const router = useRouter();
  const hostname = process.env.SERVER_URL;
  const link = `${hostname}${router.asPath}`;

  // desactivation des champs candidat et publique
  schema.fields[
    schema.fields.findIndex((field) => field.id === 'candidatId')
  ].disable = () => true;

  schema.fields[
    schema.fields.findIndex((field) => field.id === 'isPublic')
  ].disabled = true;

  const postOpportunity = async (opportunity) => {
    try {
      await Axios.post(`/api/v1/opportunity/`, opportunity);
      UIkit.notification(
        `Merci pour votre message, ${firstName} et son coach reviennent vers vous bientôt.`,
        'success'
      );
    } catch (err) {
      UIkit.notification(`Une erreur est survenue.`, 'danger');
    }
  };
  const openNewsletterModal = () =>
    UIkit.modal(`#info-share-${firstName}`).show();

  return (
    <div className="uk-card uk-card-default uk-card-body uk-text-center uk-margin-medium ">
      <h1 className="uk-width-xxlarge uk-margin-auto">
        <span className="uk-text-uppercase uk-text-primary">{firstName}</span>
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
        data-uk-toggle="target: #modal-send-opportunity"
      >
        J&apos;écris à {firstName}
      </button>
      <ModalEdit
        id="modal-send-opportunity"
        title={`Proposer une opportunité à ${firstName}`}
        description={
          "Cet espace est dédié aux potentiels recruteurs qui souhaitent proposer des opportunités aux candidats. Écrivez vos mots d'encouragement ou contactez avec le coach plus bas dans la page CV !"
        }
        submitText="Envoyer"
        defaultValues={{
          isPublic: false,
          candidatId: {
            value: userId,
            label: `${firstName}`,
          },
        }}
        formSchema={schema}
        onSubmit={(fields) =>
          postOpportunity({
            ...fields,
            usersId: [userId],
          })
        }
      />
      <p>partagez le CV de {firstName} sur vos réseaux</p>
      <div className="uk-flex uk-flex-row uk-flex-center">
        <LinkedinShareButton
          onShareWindowClose={openNewsletterModal}
          url={link}
          title={title}
          description={sharedDescription}
          style={{ cursor: 'pointer' }}
          className="uk-icon-link uk-text-primary uk-margin-right"
        >
          <IconNoSSR name="linkedin" ratio={1.5} />
        </LinkedinShareButton>
        <FacebookShareButton
          onShareWindowClose={openNewsletterModal}
          url={link}
          quote={sharedDescription}
          hashtags={hashtags}
          style={{ cursor: 'pointer' }}
          className="uk-icon-link uk-text-primary uk-margin-right"
        >
          <IconNoSSR name="facebook" ratio={1.5} />
        </FacebookShareButton>
        <TwitterShareButton
          onShareWindowClose={openNewsletterModal}
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
          onShareWindowClose={openNewsletterModal}
          url={link}
          title={sharedDescription}
          style={{ cursor: 'pointer' }}
          className="uk-icon-link uk-text-primary"
        >
          <IconNoSSR name="whatsapp" ratio={1.5} />
        </WhatsappShareButton>
      </div>
      <ModalShareCV id={`info-share-${firstName}`} firstName={firstName} />
    </div>
  );
};
CVPresentationCard.propTypes = {
  firstName: PropTypes.string.isRequired,
  intro: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default CVPresentationCard;
