import React from 'react';
import PropTypes from 'prop-types';
import HeaderBackoffice from '../headers/HeaderBackoffice';
import CandidatHeader from '../backoffice/cv/CandidatHeader';

const CVEditWelcome = ({ user, candidatForCoach }) => {
  if (user === null) {
    return null;
  }
  return (
    <HeaderBackoffice
      childrenBottom
      title={`Ravi de te revoir,${user.role === 'Coach' ? ' coach' : ''} ${
        user.firstName
      } !`}
      description={
        user.role === 'Candidat'
          ? "Bienvenue dans ton espace personnel, depuis lequel tu peux modifier les informations qui s'affichent dans ta page profil candidat sur LinkedOut."
          : `Bienvenue dans l'espace personnel de ton candidat rattaché, depuis lequel tu peux modifier avec lui ses informations qui s'affichent dans la page profil candidat sur LinkedOut.`
      }
    >
      {user.role === 'Coach' && (
        <CandidatHeader
          member={
            candidatForCoach && {
              ...candidatForCoach.candidat,
              url: candidatForCoach.url,
            }
          }
        />
      )}
    </HeaderBackoffice>
  );
};
CVEditWelcome.propTypes = {
  user: PropTypes.shape().isRequired,
  candidatForCoach: PropTypes.shape(),
};
CVEditWelcome.defaultProps = {
  candidatForCoach: undefined,
};

export default CVEditWelcome;
