import { useEffect, useState } from 'react';
import { ADMIN_ROLES, USER_ROLES } from 'src/constants';
import Api from 'src/Axios';

const reducePromisesResults = (data) => {
  return data.reduce((acc, curr) => {
    if (curr && curr.data) {
      return {
        ...acc,
        ...curr.data,
      };
    }
    return acc;
  }, {});
};

export function useNotifBadges(user, path) {
  const [badges, setBadges] = useState({
    offers: 0,
    note: 0,
    cv: 0,
    members: 0,
  });

  useEffect(() => {
    if (user) {
      if (user.role === USER_ROLES.ADMIN) {
        const queries = {
          members: `${process.env.SERVER_URL}/api/v1/user/members/count`,
          offers: `${process.env.SERVER_URL}/api/v1/opportunity/admin/count`,
        };
        const queriesToExecute = [];
        switch (user.adminRole) {
          case ADMIN_ROLES.CANDIDATES:
            queriesToExecute.push(queries.members);
            break;
          case ADMIN_ROLES.COMPANIES:
            queriesToExecute.push(queries.offers);
            break;
          default:
            queriesToExecute.push(queries.members);
            queriesToExecute.push(queries.offers);
            break;
        }
        Promise.all(
          queriesToExecute.map((query) => {
            return Api.get(query);
          })
        )
          .then((data) => {
            if (data) {
              const { pendingCVs, pendingOpportunities } =
                reducePromisesResults(data);

              setBadges((prevBadges) => {
                return {
                  ...prevBadges,
                  members: pendingCVs ?? 0,
                  offers: pendingOpportunities ?? 0,
                };
              });
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        let candidateId;
        if (user.role === USER_ROLES.CANDIDAT) {
          candidateId = user.id;
        } else if (user.role === USER_ROLES.COACH) {
          candidateId = user.candidat?.id;
        }
        if (candidateId) {
          Promise.all([
            Api.get(
              `${process.env.SERVER_URL}/api/v1/opportunity/user/count/${candidateId}`
            ),
            Api.get(
              `${process.env.SERVER_URL}/api/v1/user/candidat/checkUpdate`
            ),
            Api.get(`${process.env.SERVER_URL}/api/v1/cv/checkUpdate`),
          ])
            .then((data) => {
              if (data) {
                const {
                  unseenOpportunities,
                  noteHasBeenModified,
                  cvHasBeenModified,
                } = reducePromisesResults(data);

                setBadges((prevBadges) => {
                  return {
                    ...prevBadges,
                    offers: unseenOpportunities ?? 0,
                    note: noteHasBeenModified ? 1 : 0,
                    cv: cvHasBeenModified ? 1 : 0,
                  };
                });
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }
    }
  }, [user, path]);

  return badges;
}
