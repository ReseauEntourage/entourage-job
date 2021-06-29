import React from 'react';
import PostJobAdModal, { modalId } from '../modals/PostJobAdModal';
import { event } from '../../lib/gtag';
import TAGS from '../../constants/tags';

const GlobalOffer = () => {
  return (
    <h4 className="uk-text-bold uk-margin-large-top uk-text-center">
      Vous n&apos;avez pas trouvé de profils qui correspondent à vos besoins de
      recrutement ? Pas de problème&nbsp;! Dès la rentrée, plus de 160 candidats
      LKO s&apos;apprêtent à se lancer dans la recherche d&apos;une nouvelle
      expérience professionnelle&nbsp;!
      <br />
      <br />
      <a
        style={{ textDecoration: 'underline' }}
        data-uk-toggle={`#${modalId}`}
        onClick={() => {
          return event(TAGS.PAGE_RECRUTER_DEPOSER_OFFRE_CLIC);
        }}
      >
        Laissez-nous votre contact ou votre besoin et nous revenons vers vous.
      </a>
      <PostJobAdModal />
    </h4>
  );
};

export default GlobalOffer;
