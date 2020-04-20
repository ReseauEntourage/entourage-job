import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR, SimpleLink, IconNoSSR } from '../../utils';
import ImgProfile from '../../headers/ImgProfile';

const CandidatHeader = ({ user }) => {
  if (!user) return null;
  return (
    <GridNoSSR row gap="small" middle>
      <ImgProfile user={user} size={48} />
      {/* <img
        className="uk-preserve-width uk-border-circle"
        src={user.urlImg || '/static/img/arthur.png'}
        width="48"
        style={{ height: '48px' }}
        alt={`${user.firstName} profil`}
      /> */}
      <GridNoSSR column gap="collapse">
        <h3 className="uk-text-bold">
          {user.firstName} {user.lastName}
        </h3>

        {user.role === 'Coach' ? (
          <span>
            Coach de{' '}
            {user.coach && user.coach.candidat ? (
              <span className="uk-text-italic">
                {user.coach.candidat.firstName} {user.coach.candidat.lastName}
              </span>
            ) : (
              'personne'
            )}
          </span>
        ) : (
          <span>{user.role}</span>
        )}
        {(user.role === 'Candidat' ||
          (user.role === 'Coach' && user.coach)) && (
          <SimpleLink
            className="uk-link-text"
            target="_blank"
            href={`/cv/${
              user[user.role === 'Candidat' ? 'candidat' : 'coach'].url
            }`}
          >
            <span>
              {process.env.SERVER_URL}/cv/
              {user[user.role === 'Candidat' ? 'candidat' : 'coach'].url}
            </span>
            <IconNoSSR name="link" />
          </SimpleLink>
        )}
      </GridNoSSR>
    </GridNoSSR>
  );
};
CandidatHeader.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    urlImg: PropTypes.string,
    role: PropTypes.string,
    candidat: PropTypes.shape({
      url: PropTypes.string,
      coach: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
    coach: PropTypes.shape({
      url: PropTypes.string,
      candidat: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default CandidatHeader;
