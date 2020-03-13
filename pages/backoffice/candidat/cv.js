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
  const [userCompleteData, setUserCompleteData] = useState();

  useEffect(() => {
    if (user) {
      Api.get(`/api/v1/user/${user.id}`)
        .then(({ data }) => setUserCompleteData(data))
        .catch(() => {
          UIkit.notification('Erreur lors du chargement du suivi', 'danger');
        });
    }
  }, [user]);
  return (
    <LayoutBackOffice title="Edition du CV">
      <Section>
        {userCompleteData && (
          <>
            <CVEditWelcome user={userCompleteData} />
            <CVPageContent
              candidatId={
                userCompleteData.role === 'Coach'
                  ? userCompleteData.coach.candidat.id
                  : userCompleteData.id
              }
            />
          </>
        )}
      </Section>
    </LayoutBackOffice>
  );
};
export default Edit;
