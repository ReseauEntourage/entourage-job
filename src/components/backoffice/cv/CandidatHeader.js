import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { GridNoSSR, SimpleLink, IconNoSSR } from 'src/components/utils';
import ImgProfile from 'src/components/headers/ImgProfile';
import { USER_ROLES } from 'src/constants';

const CandidatHeader = ({ user, showZone }) => {
  if (!user) return null;
  return (
    <GridNoSSR row gap="small">
      <ImgProfile user={user} size={48} />
      <GridNoSSR column gap="collapse">
        <h3 className="uk-text-bold">
          {user.firstName} {user.lastName}
        </h3>
        <GridNoSSR row gap="small" middle className="uk-margin-small-top">
          <IconNoSSR name="user" style={{ width: 20 }} />
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
        </GridNoSSR>
        <GridNoSSR row gap="small" middle className="uk-margin-small-top">
          <IconNoSSR name="link" style={{ width: 20 }} />
          {(user.role === USER_ROLES.CANDIDAT ||
            (user.role === USER_ROLES.COACH && user.coach)) && (
            <SimpleLink
              className="uk-link-text uk-margin-small-top"
              target="_blank"
              href={`/cv/${
                user[user.role === USER_ROLES.CANDIDAT ? 'candidat' : 'coach']
                  .url
              }`}
            >
              <span>
                {process.env.SERVER_URL}/cv/
                {
                  user[user.role === USER_ROLES.CANDIDAT ? 'candidat' : 'coach']
                    .url
                }
              </span>
            </SimpleLink>
          )}
        </GridNoSSR>
        {showZone && (
          <GridNoSSR row gap="small" middle className="uk-margin-small-top">
            <span className="uk-label">
              {user.zone ? _.capitalize(user.zone) : 'Non renseignée'}
            </span>
          </GridNoSSR>
        )}
      </GridNoSSR>
    </GridNoSSR>
  );
};

CandidatHeader.defaultProps = {
  showZone: false,
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
    zone: PropTypes.string,
  }).isRequired,
  showZone: PropTypes.bool,
};

export default CandidatHeader;
