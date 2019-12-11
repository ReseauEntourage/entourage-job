import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../store/UserProvider';

const CVEditWelcome = ({ cv }) => {
  const userContext = useContext(UserContext);

  if (!userContext.user) {
    return null;
  }
  if (userContext.user.role === 'Candidat') {
    return (
      <>
        <h2 className="uk-text-bold">
          Ravi de te revoir, {userContext.user.firstName} !
        </h2>
        <div className="uk-grid-match" data-uk-grid>
          <div className="uk-width-2-3@m">
            <p className="uk-text-lead">
              Bienvenue dans ton espace personnel, depuis lequel tu peux
              modifier les informations qui s&apos;affichent dans ta page profil
              candidat sur LinkedOut.
            </p>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <h2 className="uk-text-bold">
        Ravi de te revoir, coach {userContext.user.firstName} !
      </h2>
      <div className="uk-grid-match" data-uk-grid>
        <div className="uk-width-2-3@m">
          <p className="uk-text-lead">
            Bienvenue dans l&apos;espace personnel{' '}
            {cv.firstName ? `de ${cv.firstName}` : 'de ton candidat rattaché'},
            depuis lequel tu peux modifier avec lui ses informations qui
            s&apos;affichent dans la page profil candidat sur LinkedOut.
          </p>
        </div>
      </div>
    </>
  );
};

CVEditWelcome.propTypes = {
  cv: PropTypes.shape(),
};

CVEditWelcome.defaultProps = {
  cv: {},
};

export default CVEditWelcome;
