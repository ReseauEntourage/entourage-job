import React, { useCallback, useContext, useEffect, useState } from 'react';
import OpportunityList from 'src/components/opportunities/OpportunityList';
import { initializeFilters } from 'src/utils';
import { ADMIN_ZONES, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { useFilters } from 'src/hooks';
import { UserContext } from 'src/components/store/UserProvider';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import { Section } from 'src/components/utils';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import Api from 'src/Axios';
import FiltersTabs from 'src/components/utils/FiltersTabs';
import {
  OFFER_CANDIDATE_FILTERS_DATA,
  OPPORTUNITY_FILTERS_DATA,
  USER_ROLES,
} from 'src/constants';
import OpportunityError from 'src/components/opportunities/OpportunityError';
import SearchBar from 'src/components/filters/SearchBar';

const candidateFilters = OPPORTUNITY_FILTERS_DATA.slice(1);

const Opportunities = () => {
  const { user } = useContext(UserContext);

  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDefaultFilters, setLoadingDefaultFilters] = useState(true);

  const [candidatId, setCandidatId] = useState();

  const [tabFilters, setTabFilters] = useState(OFFER_CANDIDATE_FILTERS_DATA);
  const {
    filters,
    setFilters,
    search,
    setSearch,
    numberOfResults,
    setNumberOfResults,
    resetFilters,
  } = useFilters(candidateFilters, {
    href: '/backoffice/candidats/offres',
  });

  const setCandidatZone = useCallback(
    (candidatZone) => {
      if (!candidatZone || candidatZone === ADMIN_ZONES.HZ) {
        setFilters(initializeFilters(candidateFilters));
      } else {
        const defaultDepartmentsForCandidate = DEPARTMENTS_FILTERS.filter(
          (dept) => {
            return candidatZone === dept.zone;
          }
        );

        setFilters(
          initializeFilters(candidateFilters, {
            [candidateFilters[1].key]: [...defaultDepartmentsForCandidate],
          })
        );
      }
    },
    [setFilters]
  );

  useEffect(() => {
    if (user) {
      setLoading(true);
      const updatedFilterConsts = [...OFFER_CANDIDATE_FILTERS_DATA];
      updatedFilterConsts[1].title =
        user.role === USER_ROLES.CANDIDAT ? 'Mes offres' : 'Offres du candidat';
      setTabFilters(updatedFilterConsts);

      if (user.role === USER_ROLES.CANDIDAT) {
        setCandidatId(user.id);
        setCandidatZone(user.zone);
        setLoading(false);
        setLoadingDefaultFilters(false);
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
            setLoadingDefaultFilters(false);
          })
          .catch(() => {
            setLoading(false);
            return setHasError(true);
          });
      }
    }
  }, [setCandidatZone, user]);

  if (!user) return null;

  return (
    <LayoutBackOffice
      title={
        user.role === USER_ROLES.CANDIDAT
          ? 'Mes opportunités'
          : 'Opportunités du candidat'
      }
    >
      <Section>
        <HeaderBackoffice
          title={
            user.role === USER_ROLES.CANDIDAT
              ? 'Consultez toutes les opportunités de travail'
              : 'Consultez les opportunités de travail du candidat'
          }
          description={
            user.role === USER_ROLES.CANDIDAT
              ? 'Parcourez les offres qui vous sont directement adressées ainsi que celles communes aux différents candidats du parcours LinkedOut.'
              : 'Parcourez les offres qui ont été adressées à votre candidat ainsi que celles communes aux différents candidats du parcours LinkedOut.'
          }
        />
        {hasError ? (
          <OpportunityError />
        ) : (
          <>
            <FiltersTabs
              loading={loading}
              tabFilters={tabFilters}
              setTabFilters={setTabFilters}
              otherFilterComponent={
                <SearchBar
                  filtersConstants={candidateFilters}
                  filters={filters}
                  numberOfResults={numberOfResults}
                  resetFilters={resetFilters}
                  search={search}
                  setSearch={setSearch}
                  setFilters={setFilters}
                  placeholder="Rechercher..."
                />
              }
            >
              {candidatId && !loadingDefaultFilters && (
                <OpportunityList
                  search={search}
                  candidatId={candidatId}
                  tabFilter={
                    tabFilters.find((filter) => {
                      return filter.active;
                    }).tag
                  }
                  filters={filters}
                  updateNumberOfResults={setNumberOfResults}
                />
              )}
            </FiltersTabs>
          </>
        )}
      </Section>
    </LayoutBackOffice>
  );
};
export default Opportunities;
