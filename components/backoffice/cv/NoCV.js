import React from 'react';
import PropTypes from 'prop-types';
import { Button, GridNoSSR } from '../../utils';
import { CV_STATUS, USER_ROLES } from '../../../constants';
import Api from '../../../Axios';

const NoCV = ({ candidatId, user, setCV }) => {
  return (
    <GridNoSSR column middle>
      <div>
        {user.role === USER_ROLES.COACH &&
          (!user.candidat || (user.candidat && user.candidat.deletedAt)) && (
            <>
              <h2 className="uk-text-bold">
                <span className="uk-text-primary">Aucun candidat</span>
                n&apos;est rattaché à ce compte coach.
              </h2>
              <p>
                Il peut y avoir plusieurs raisons à ce sujet. Contactez
                l&apos;équipe LinkedOut pour en savoir plus.
              </p>
            </>
          )}
        {(user.role === USER_ROLES.ADMIN ||
          user.role === USER_ROLES.CANDIDAT ||
          (user.role === USER_ROLES.COACH && user.candidat)) && (
          <>
            <h2 className="uk-text-bold">
              <span className="uk-text-primary">Aucun CV</span>
              &nbsp;n&apos;est rattaché à ce compte.
            </h2>
            <div className="uk-flex uk-flex-center">
              <Button
                style="primary"
                onClick={() =>
                  Api.post(`${process.env.SERVER_URL}/api/v1/cv`, {
                    cv: { UserId: candidatId, status: CV_STATUS.New.value },
                  }).then(({ data }) => setCV(data))
                }
              >
                Créer le CV
              </Button>
            </div>
          </>
        )}
      </div>
    </GridNoSSR>
  );
};

NoCV.propTypes = {
  candidatId: PropTypes.string.isRequired,
  user: PropTypes.shape({
    role: PropTypes.string,
    candidat: PropTypes.shape(),
  }).isRequired,
  setCV: PropTypes.func.isRequired,
};

export default NoCV;
