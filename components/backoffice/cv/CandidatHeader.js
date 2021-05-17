import React from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR, SimpleLink, IconNoSSR } from '../../utils';
import ImgProfile from '../../headers/ImgProfile';
import { USER_ROLES } from '../../../constants';

const CandidatHeader = ({ user }) => {
  if (!user) return null;
  return (
    <GridNoSSR row gap="small" middle>
      <ImgProfile user={user} size={48} />
      <GridNoSSR column gap="collapse">
        <h3 className="uk-text-bold">
          {user.firstName} {user.lastName}
        </h3>

        {user.role === USER_ROLES.COACH ? (
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
        {(user.role === USER_ROLES.CANDIDAT ||
          (user.role === USER_ROLES.COACH && user.coach)) && (
          <SimpleLink
            className="uk-link-text"
            target="_blank"
            href={`/cv/${
              user[user.role === USER_ROLES.CANDIDAT ? 'candidat' : 'coach'].url
            }`}
          >
            <span>
              {process.env.SERVER_URL}/cv/
              {
                user[user.role === USER_ROLES.CANDIDAT ? 'candidat' : 'coach']
                  .url
              }
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
