import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import HeaderBackoffice from '../headers/HeaderBackoffice';
import CandidatHeader from '../backoffice/cv/CandidatHeader';
import { UserContext } from '../store/UserProvider';

const CVEditWelcome = ({ user }) => {
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
      {user.role === 'Coach' && <CandidatHeader user={user} />}
    </HeaderBackoffice>
  );
};
CVEditWelcome.propTypes = {
  user: PropTypes.shape(),
};
CVEditWelcome.defaultProps = {
  user: undefined,
};

export default CVEditWelcome;
