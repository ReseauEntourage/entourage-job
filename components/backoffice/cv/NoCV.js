import React from 'react';
import PropTypes from 'prop-types';
import { Button, GridNoSSR } from '../../utils';
import {CV_STATUS, USER_ROLES} from '../../../constants';
import Api from "../../../Axios";

const NoCV = ({ candidatId, user, setCV }) => (
  <GridNoSSR column middle>
    <div>
      {user.role === USER_ROLES.COACH && !user.candidatId && (
        <>
          <h2 className="uk-text-bold">
            <span className="uk-text-primary">Aucun candidat</span>{' '}
            n&apos;est rattaché à ce compte coach.
          </h2>
          <p>
            Il peut y avoir plusieurs raisons à ce sujet. Contacte
            l&apos;équipe LinkedOut pour en savoir plus.
          </p>
        </>
      )}
      {(user.role === USER_ROLES.ADMIN ||
        user.role === USER_ROLES.CANDIDAT ||
        (user.role === USER_ROLES.COACH && user.candidatId)) && (
        <>
          <h2 className="uk-text-bold">
            <span className="uk-text-primary">Aucun CV</span> n&apos;est
                                                              rattaché à ce compte.
          </h2>
          <Button
            style="primary"
            onClick={() =>
              Api.post(`${process.env.SERVER_URL}/api/v1/cv`, {
                cv: { userId: candidatId, status: CV_STATUS.New.value },
              }).then(({ data }) => setCV(data))
            }
          >
            Créer le CV
          </Button>
        </>
      )}
    </div>
  </GridNoSSR>
);
NoCV.propTypes = {
  candidatId: PropTypes.string.isRequired,
  user: PropTypes.shape({
    role: PropTypes.string,
    candidatId: PropTypes.string.isRequired,
  }).isRequired,
  setCV: PropTypes.func.isRequired
};

export default NoCV;
