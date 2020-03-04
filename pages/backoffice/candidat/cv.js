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
  const [candidatId, setCandidatId] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.role === 'Coach') {
        if (user.userToCoach) {
          Api.get(
            `${process.env.SERVER_URL}/api/v1/user/${user.userToCoach}`
          ).then(({ data }) => {
            setCandidat(data);
            setCandidatId(data.id);
          });
        } else {
          setCandidat(null);
          setCandidatId(null);
        }
      }
      if (user.role === 'Candidat') {
        setCandidat(user);
        setCandidatId(user.id);
      }
    }
  }, [user]);

  return (
    <LayoutBackOffice title="Edition du CV">
      <Section>
        <CVEditWelcome user={user} candidatForCoach={candidat} />
        <CVPageContent candidatId={candidatId} />
      </Section>
    </LayoutBackOffice>
  );
};
export default Edit;
