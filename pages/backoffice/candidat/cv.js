/* global UIkit */
import React, { useContext, useEffect, useState } from 'react';
import LayoutBackOffice from '../../../components/backoffice/LayoutBackOffice';
import Api from '../../../Axios';
import { Section } from '../../../components/utils';
import CVEditWelcome from '../../../components/cv/CVEditWelcome';
import { UserContext } from '../../../components/store/UserProvider';
import CVPageContent from '../../../components/backoffice/cv/CVPageContent';

const Edit = () => {
  const { user } = useContext(UserContext);
  const [candidatForCoach, setCandidatForCoach] = useState(null);

  useEffect(() => {
    if (user && user.userToCoach) {
      Api.get(
        `${process.env.SERVER_URL}/api/v1/user/${user.userToCoach}`
      ).then(({ data }) => setCandidatForCoach(data));
    }
  }, [user]);

  return (
    <LayoutBackOffice title="Edition du CV">
      <Section>
        <CVEditWelcome user={user} candidatForCoach={candidatForCoach} />
        <CVPageContent member={user} />
      </Section>
    </LayoutBackOffice>
  );
};
export default Edit;
