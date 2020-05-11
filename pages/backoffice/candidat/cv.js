/* global UIkit */
import React, { useContext, useEffect, useState } from 'react';
import LayoutBackOffice from '../../../components/backoffice/LayoutBackOffice';
import Api from '../../../Axios';
import { Section } from '../../../components/utils';
import CVEditWelcome from '../../../components/cv/CVEditWelcome';
import { UserContext } from '../../../components/store/UserProvider';
import CVPageContent from '../../../components/backoffice/cv/CVPageContent';
import {USER_ROLES} from "../../../constants";

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
            {userCompleteData.role === USER_ROLES.COACH &&
              (userCompleteData.coach ? (
                <CVPageContent
                  candidatId={
                    userCompleteData.role === USER_ROLES.COACH
                      ? userCompleteData.coach.candidat.id
                      : userCompleteData.id
                  }
                />
              ) : (
                <>
                  <h2 className="uk-text-bold">
                    <span className="uk-text-primary">
                      {user.role === USER_ROLES.COACH
                        ? 'Aucun candidat'
                        : 'Aucun bénévole coach'}
                    </span>{' '}
                    n&apos;est rattaché à ce compte.
                  </h2>
                  <p>
                    Il peut y avoir plusieurs raisons à ce sujet. Contacte
                    l&apos;équipe LinkedOut pour en savoir plus.
                  </p>
                </>
              ))}
            {userCompleteData.role === USER_ROLES.CANDIDAT && (
              <CVPageContent candidatId={userCompleteData.id} />
            )}
          </>
        )}
      </Section>
    </LayoutBackOffice>
  );
};
export default Edit;
