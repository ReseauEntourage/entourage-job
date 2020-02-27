import React from 'react';
import PropTypes from 'prop-types';
import { Button, GridNoSSR } from '../../utils';

const NoCV = ({ createCV, user }) => (
  <GridNoSSR column middle>
    {user.role === 'Candidat' && (
      <div>
        <h2 className="uk-text-bold">
          <span className="uk-text-primary">Aucun CV</span> n&apos;est rattaché
          à votre compte candidat.
        </h2>
        <Button style="primary" onClick={createCV}>
          Creer votre CV
        </Button>
      </div>
    )}
    {user.role === 'Coach' && !user.userToCoach && (
      <div>
        <h2 className="uk-text-bold">
          <span className="uk-text-primary">Aucun candidat</span> n&apos;est
          rattaché à ce compte coach.
        </h2>
        <p>
          Il peut y avoir plusieurs raisons à ce sujet. Contacte l&apos;équipe
          LinkedOut pour en savoir plus.
        </p>
      </div>
    )}
    {user.role === 'Coach' && user.userToCoach && (
      <div>
        <h2 className="uk-text-bold">
          <span className="uk-text-primary">Aucun CV</span> n&apos;est rattaché
          à ce compte candidat.
        </h2>
        <Button style="primary" onClick={createCV}>
          Créer son CV
        </Button>
      </div>
    )}
  </GridNoSSR>
);
NoCV.propTypes = {
  createCV: PropTypes.func.isRequired,
  user: PropTypes.shape({
    role: PropTypes.string,
    userToCoach: PropTypes.string.isRequired,
  }).isRequired,
};

export default NoCV;
