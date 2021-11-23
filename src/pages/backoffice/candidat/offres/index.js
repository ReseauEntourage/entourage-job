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

const candidateFilters = OPPORTUNITY_FILTERS_DATA.slice(1);

const Opportunities = () => {
  const {
    replace,
    query: { offerId, tag, ...restParams },
  } = useRouter();

  const { user } = useContext(UserContext);

  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDefaultFilters, setLoadingDefaultFilters] = useState(true);

  const [candidatId, setCandidatId] = useState();

  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    candidateFilters,
    {
      href: '/backoffice/candidat/offres',
    }
  );

  const setCandidatZone = useCallback(
    (candidatZone) => {
      if (!tag) {
        const params = {
          tag: OFFER_CANDIDATE_FILTERS_DATA[1].tag,
          ...restParams,
        };

        if (candidatZone && candidatZone !== ADMIN_ZONES) {
          const defaultDepartmentsForCandidate = DEPARTMENTS_FILTERS.filter(
            (dept) => {
              return candidatZone === dept.zone;
            }
          );

          params.department = defaultDepartmentsForCandidate.map((dept) => {
            return dept.value;
          });
        }
        if (offerId) {
          replace(
            {
              pathname: '/backoffice/candidat/offres/[offerId]',
              query: params,
            },
            {
              pathname: `/backoffice/candidat/offres/${offerId}`,
              query: params,
            },
            {
              shallow: true,
            }
          );
        } else {
          replace(
            {
              pathname: '/backoffice/candidat/offres',
              query: params,
            },
            undefined,
            {
              shallow: true,
            }
          );
        }
      } else {
        setLoadingDefaultFilters(false);
      }
    },
    [offerId, replace, restParams, tag]
  );

  useEffect(() => {
    if (user) {
      setLoading(true);

      if (user.role === USER_ROLES.CANDIDAT) {
        setCandidatId(user.id);
        setCandidatZone(user.zone);
        setLoading(false);
      } else if (user.role === USER_ROLES.COACH) {
        Api.get(`/api/v1/user/candidat/`, {
          params: {
            coachId: user.id,
          },
        })
          .then(({ data }) => {
            if (data) {
              setCandidatId(data.candidat.id);
              setCandidatZone(data.candidat.zone);
            } else {
              setHasError(true);
            }
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
            return setHasError(true);
          });
      }
    }
  }, [setCandidatZone, user]);

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
