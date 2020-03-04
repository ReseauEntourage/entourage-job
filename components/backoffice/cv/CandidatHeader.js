import React from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR, SimpleLink, IconNoSSR } from '../../utils';

const CandidatHeader = ({ member, candidatForCoach }) => {
  if (!member) return null;
  return (
    <GridNoSSR row gap="small" middle>
      <img
        className="uk-preserve-width uk-border-circle"
        src={member.urlImg || '/static/img/arthur.png'}
        width="48"
        style={{ height: '48px' }}
        alt={`${member.firsName} profil`}
      />
      <GridNoSSR column gap="collapse">
        <h3 className="uk-text-bold">
          {member.firstName} {member.lastName}
        </h3>

        {member.role === 'Coach' && candidatForCoach ? (
          <span>
            Coach de{' '}
            <span className="uk-text-italic">
              {candidatForCoach.firstName} {candidatForCoach.lastName}
            </span>
          </span>
        ) : (
          <span>{member.role}</span>
        )}
        {member.role === 'Candidat' && (
          <SimpleLink
            className="uk-link-text"
            target="_blank"
            href={`${process.env.SERVER_URL}/cv/${member.url}`}
          >
            <span>
              {process.env.SERVER_URL}/cv/{member.url}
            </span>
            <IconNoSSR name="link" />
          </SimpleLink>
        )}
        {member.role === 'Coach' && candidatForCoach && (
          <SimpleLink
            className="uk-link-text"
            target="_blank"
            href={`${process.env.SERVER_URL}/cv/${candidatForCoach.url}`}
          >
            <span>
              {process.env.SERVER_URL}/cv/{candidatForCoach.url}
            </span>
            <IconNoSSR name="link" />
          </SimpleLink>
        )}
      </GridNoSSR>
    </GridNoSSR>
  );
};
CandidatHeader.propTypes = {
  member: PropTypes.shape().isRequired,
  candidatForCoach: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    url: PropTypes.string,
  }),
};
CandidatHeader.defaultProps = {
  candidatForCoach: null,
};

export default CandidatHeader;
