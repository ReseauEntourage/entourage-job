import React from 'react';
import PropTypes from 'prop-types';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import CandidatHeader from 'src/components/backoffice/cv/CandidatHeader';
import { USER_ROLES } from 'src/constants';

const CVEditWelcome = ({ user }) => {
  if (user === null) {
    return null;
  }
  return (
    <HeaderBackoffice
      childrenBottom
      title={`Ravi de vous revoir,${
        user.role === USER_ROLES.COACH ? ' coach' : ''
      } ${user.firstName} !`}
      description={
        user.role === USER_ROLES.CANDIDAT
          ? "Bienvenue dans votre espace personnel, depuis lequel vous pouvez modifier les informations qui s'affichent sur votre CV sur LinkedOut."
          : `Bienvenue dans l'espace personnel de votre candidat, depuis lequel vous pouvez modifier avec lui/elle les informations qui s'affichent sur son CV sur LinkedOut.`
      }
    >
      {user.role === USER_ROLES.COACH && <CandidatHeader user={user} />}
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
