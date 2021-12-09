import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ADMIN_ZONES, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { useFilters } from 'src/hooks';
import { UserContext } from 'src/components/store/UserProvider';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import { Section } from 'src/components/utils';
import Api from 'src/Axios';
import {
  OFFER_CANDIDATE_FILTERS_DATA,
  OPPORTUNITY_FILTERS_DATA,
  USER_ROLES,
} from 'src/constants';
import OpportunityError from 'src/components/opportunities/OpportunityError';
import { useRouter } from 'next/router';
import CandidateOpportunityList from 'src/components/backoffice/candidate/CandidateOpportunityList';
import { usePrevious } from 'src/hooks/utils';

const candidateFilters = OPPORTUNITY_FILTERS_DATA.slice(1);

const Opportunities = () => {
  const {
    replace,
    query: { q, offerId, tag, ...restParams },
  } = useRouter();

  const { user } = useContext(UserContext);
  const prevUser = usePrevious(user);

  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDefaultFilters, setLoadingDefaultFilters] = useState(true);

  const [candidatId, setCandidatId] = useState();
  const prevCandidatId = usePrevious(candidatId);

  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    candidateFilters,
    {
      href: '/backoffice/candidat/offres',
    },
    ['offerId']
  );

  const setCandidatDepartments = useCallback(
    (candId, candidatZone) => {
      if (!tag) {
        const params = {
          tag: OFFER_CANDIDATE_FILTERS_DATA[1].tag,
          ...restParams,
        };

        Api.get(`/api/v1/cv/`, {
          params: {
            userId: candId,
          },
        })
          .then(({ data }) => {
            if (data.locations && data.locations.length > 0) {
              params.department = data.locations;
            } else if (candidatZone && candidatZone !== ADMIN_ZONES.HZ) {
              const defaultDepartmentsForCandidate = DEPARTMENTS_FILTERS.filter(
                (dept) => {
                  return candidatZone === dept.zone;
                }
              );

              params.department = defaultDepartmentsForCandidate.map((dept) => {
                return dept.value;
              });
            }
            replace(
              {
                pathname: `/backoffice/candidat/offres${
                  offerId ? '/[offerId]' : ''
                }`,
                query: params,
              },
              {
                pathname: `/backoffice/candidat/offres${
                  offerId ? `/${offerId}` : ''
                }`,
                query: params,
              },
              {
                shallow: true,
              }
            );
          })
          .catch(() => {
            setHasError(true);
          });
      } else {
        setCandidatId(candId);
        setLoadingDefaultFilters(false);
      }
    },
    [offerId, replace, restParams, tag]
  );

  useEffect(() => {
    const redirectParams = tag
      ? {
          tag,
          ...restParams,
        }
      : restParams;

    // For retrocompatibility
    if (q) {
      replace(
        {
          pathname: '/backoffice/candidat/offres/[offerId]',
          query: redirectParams,
        },
        {
          pathname: `/backoffice/candidat/offres/${q}`,
          query: redirectParams,
        },
        {
          shallow: true,
        }
      );
    } else if (user) {
      if (user.role !== USER_ROLES.COACH && user.role !== USER_ROLES.CANDIDAT) {
        replace(
          {
            pathname: `/backoffice/admin/offres${offerId ? '/[offerId]' : ''}`,
            query: redirectParams,
          },
          {
            pathname: `/backoffice/admin/offres${offerId ? `/${offerId}` : ''}`,
            query: redirectParams,
          },
          {
            shallow: true,
          }
        );
      } else if (user !== prevUser || !candidatId) {
        setLoading(true);
        if (user.role === USER_ROLES.CANDIDAT) {
          setCandidatDepartments(user.id, user.zone);
          setLoading(false);
        } else if (user.role === USER_ROLES.COACH) {
          Api.get(`/api/v1/user/candidat/`, {
            params: {
              coachId: user.id,
            },
          })
            .then(({ data }) => {
              if (data) {
                setCandidatDepartments(data.candidat.id, user.zone);
              } else {
                setHasError(true);
              }
              setLoading(false);
            })
            .catch(() => {
              setHasError(true);
              setLoading(false);
            });
        }
      } else {
        setLoadingDefaultFilters(true);
        setCandidatDepartments(candidatId, user.zone);
      }
    }
  }, [
    candidatId,
    offerId,
    prevCandidatId,
    prevUser,
    q,
    replace,
    restParams,
    setCandidatDepartments,
    tag,
    user,
  ]);

  return (
    <LayoutBackOffice
      title={
        user && user.role === USER_ROLES.CANDIDAT
          ? 'Mes opportunités'
          : 'Opportunités du candidat'
      }
    >
      <Section>
        <>
          {!loading && hasError && <OpportunityError />}
          {!user || !candidatId || loadingDefaultFilters || loading ? (
            <div className="uk-text-center">
              <div data-uk-spinner />
            </div>
          ) : (
            <CandidateOpportunityList
              search={search}
              filters={filters}
              resetFilters={resetFilters}
              setSearch={setSearch}
              setFilters={setFilters}
              candidatId={candidatId}
            />
          )}
        </>
      </Section>
    </LayoutBackOffice>
  );
};
export default Opportunities;
