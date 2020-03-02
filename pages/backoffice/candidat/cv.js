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
  const [candidat, setCandidat] = useState({});

  useEffect(() => {
    if (user) {
      if (user.role === 'Coach' && user.userToCoach) {
        Api.get(
          `${process.env.SERVER_URL}/api/v1/user/${user.userToCoach}`
        ).then(({ data }) => setCandidat(data));
      } else {
        setCandidat(user);
      }
    }
  }, [user]);

  return (
    <LayoutBackOffice title="Edition du CV">
      <Section>
        <CVEditWelcome user={user} candidatForCoach={candidat} />
        <CVPageContent candidatId={candidat.id} />
      </Section>
    </LayoutBackOffice>
  );
};
export default Edit;
