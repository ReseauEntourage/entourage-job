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
  const [candidat, setCandidat] = useState();
  const [candidatId, setCandidatId] = useState();

  useEffect(() => {
    if (user) {
      const params = {};
      if (user.role === 'Coach') {
        params.coachId = user.id;
      }
      if (user.role === 'Candidat') {
        params.candidatId = user.id;
      }
      Api.get(`/api/v1/user/candidat/`, {
        params,
      })
        .then(({ data }) => {
          if (data) {
            setCandidat(data);
            setCandidatId(data.candidat.id);
          } else {
            setCandidat(null);
            setCandidatId(null);
          }
        })
        .catch(() => {
          UIkit.notification('Erreur lors du chargement du suivi', 'danger');
        });
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
