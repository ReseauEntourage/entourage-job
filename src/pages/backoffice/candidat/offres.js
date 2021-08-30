import React, { useState, useEffect, useContext, useCallback } from 'react';
import _ from 'lodash';
import OpportunityList from 'src/components/opportunities/OpportunityList';
import { findFilter, initializeFilters } from 'src/utils';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { useFilters } from 'src/hooks';
import { UserContext } from 'src/components/store/UserProvider';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import { Section } from 'src/components/utils';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import Api from 'src/Axios';
import Filter from 'src/components/utils/Filter';
import {
  OPPORTUNITY_FILTERS_DATA,
  USER_ROLES,
  OFFER_CANDIDATE_FILTERS_DATA,
} from 'src/constants';
import OpportunityError from 'src/components/opportunities/OpportunityError';
import SearchBar from 'src/components/filters/SearchBar';

const candidateFilters = OPPORTUNITY_FILTERS_DATA.slice(1);

const Opportunities = () => {
  const { user } = useContext(UserContext);

  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDefaultFilters, setLoadingDefaultFilters] = useState(true);
  const [search, setSearch] = useState();

  const [candidatId, setCandidatId] = useState();

  const [tabFilters, setTabFilters] = useState(OFFER_CANDIDATE_FILTERS_DATA);
  const {
    filters,
    setFilters,
    numberOfResults,
    setNumberOfResults,
    resetFilters,
  } = useFilters(candidateFilters);

  const setCandidatZone = useCallback(
    (candidatZone) => {
      if (!candidatZone) {
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
    if (candidatId) {
      setLoading(true);
      Api.get(`${process.env.SERVER_URL}/api/v1/cv/`, {
        params: {
          userId: candidatId,
        },
      })
        .then(({ data }) => {
          if (data && data.locations && data.locations.length > 0) {
            const cvFilters = data.locations.map((location) => {
              return findFilter(DEPARTMENTS_FILTERS, location);
            });
            setFilters(
              initializeFilters(candidateFilters, {
                [candidateFilters[1].key]: _.compact(cvFilters),
              })
            );
          }
          setLoadingDefaultFilters(false);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          return setLoading(false);
        });
    }
  }, [candidatId, setFilters]);

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
            <Filter
              loading={loading}
              filters={tabFilters}
              setFilters={setTabFilters}
              otherFilterComponent={
                <SearchBar
                  filtersConstants={candidateFilters}
                  filters={filters}
                  numberOfResults={numberOfResults}
                  resetFilters={resetFilters}
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
            </Filter>
          </>
        )}
      </Section>
    </LayoutBackOffice>
  );
};
export default Opportunities;
