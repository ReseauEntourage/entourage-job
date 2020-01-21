import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../store/UserProvider';
import HeaderBackoffice from '../headers/HeaderBackoffice';

const CVEditWelcome = ({ cvFirstName }) => {
  const userContext = useContext(UserContext);
  return (
    <HeaderBackoffice
      title={
        userContext.user.role === 'Candidat'
          ? `Ravi de te revoir, ${userContext.user.firstName} !`
          : `Ravi de te revoir, coach ${userContext.user.firstName} !`
      }
      description={
        userContext.user.role === 'Candidat'
          ? "Bienvenue dans ton espace personnel, depuis lequel tu peux modifier les informations qui s'affichent dans ta page profil candidat sur LinkedOut."
          : `Bienvenue dans l&apos;espace personnel ${
              cvFirstName ? `de ${cvFirstName}` : 'de ton candidat rattaché'
            }, depuis lequel tu peux modifier avec lui ses informations qui s&apos;affichent dans la page profil candidat sur LinkedOut.`
      }
    />
  );
};
CVEditWelcome.propTypes = {
  cvFirstName: PropTypes.string,
};
CVEditWelcome.defaultProps = {
  cvFirstName: undefined,
};

export default CVEditWelcome;
