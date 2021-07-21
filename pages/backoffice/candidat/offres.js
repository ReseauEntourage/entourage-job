/* global UIkit */
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import CurrentFilters from '../../../components/filters/CurrentFilters';
import FiltersSideBar from '../../../components/filters/FiltersSideBar';
import { initializeFilters } from '../../../utils';
import CandidatOpportunityList from '../../../components/opportunities/CandidatOpportunityList';
import { UserContext } from '../../../components/store/UserProvider';
import LayoutBackOffice from '../../../components/backoffice/LayoutBackOffice';
import { Section } from '../../../components/utils';
import OfferCard from '../../../components/cards/OfferCard';
import HeaderBackoffice from '../../../components/headers/HeaderBackoffice';
import ModalOffer from '../../../components/modals/ModalOffer';
import Api from '../../../Axios';
import Filter from '../../../components/utils/Filter';
import { OPPORTUNITY_FILTERS_DATA, USER_ROLES } from '../../../constants';
import OpportunityError from '../../../components/opportunities/OpportunityError';

const tabFiltersConst = [
  { tag: 'all', title: 'Toutes les offres' },
  { tag: 'private', title: 'Offres du candidat', active: true },
  { tag: 'public', title: 'Offres générales' },
  { tag: 'archived', title: 'Offres archivées' },
];

const Opportunites = () => {
  const { user } = useContext(UserContext);

  const [currentOffer, setCurrentOffer] = useState(null);
  const [offers, setOffers] = useState(undefined);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [candidatId, setCandidatId] = useState();

  /* TAB FILTERS */

  const [tabFilters, setTabFilters] = useState(tabFiltersConst);
  const [tabFilteredOffers, setTabFilteredOffers] = useState(undefined);

  const tabFilterOffers = () => {
    let filteredList = offers;
    if (offers) {
      const activeFilter = tabFilters.find((filter) => {
        return filter.active;
      });
      filteredList = filteredList.filter((offer) => {
        const isArchived =
          offer.userOpportunity && offer.userOpportunity.archived;
        switch (activeFilter.tag) {
          case tabFiltersConst[0].tag:
            return true;
          case tabFiltersConst[1].tag:
            return !offer.isPublic && !isArchived;
          case tabFiltersConst[2].tag:
            return offer.isPublic && !isArchived;
          case tabFiltersConst[3].tag:
            return offer.userOpportunity && offer.userOpportunity.archived;
          default:
            return true;
        }
      });
    }

    return filteredList;
  };

  const [filters, setFilters] = useState(
    initializeFilters(OPPORTUNITY_FILTERS_DATA)
  );
  const [numberOfResults, setNumberOfResults] = useState(0);

  const resetFilters = () => {
    setFilters(initializeFilters(OPPORTUNITY_FILTERS_DATA));
  };

  useEffect(() => {
    setHasError(false);
    setLoading(true);
    setTabFilteredOffers(tabFilterOffers());
  }, [offers, tabFilters]);

  useEffect(() => {
    if (tabFilteredOffers) {
      setLoading(false);
    }
  }, [tabFilteredOffers]);

  /* END TAB FILTERS */

  useEffect(() => {
    /* // récupére les offres et si id en url ouvre loffre en question
    const fetchAndAct = (id) => {
      return fetchData(id).then((data) => {
        if (data) {
          const offer = data.find((o) => {
            return o.id === opportunityId;
          });
          if (offer) {
            setCurrentOffer({ ...offer });
            UIkit.modal('#modal-offer').show();
          }
        }
      });
    }; */

    if (user) {
      const updatedFilterConsts = [...tabFiltersConst];
      updatedFilterConsts[1].title =
        user.role === USER_ROLES.CANDIDAT ? 'Mes offres' : 'Offres du candidat';
      setTabFilters(updatedFilterConsts);

      if (user.role === USER_ROLES.CANDIDAT) {
        setCandidatId(user.id);
      } else if (user.role === USER_ROLES.COACH) {
        Api.get(`/api/v1/user/candidat/`, {
          params: {
            coachId: user.id,
          },
        })
          .then(({ data }) => {
            if (data) {
              setCandidatId(data.candidat.id);
            } else {
              setHasError(true);
            }
          })
          .catch(() => {
            return setHasError(true);
          });
      }
    }
  }, [user]);

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
            <div
              style={{ maxWidth: 1100 }}
              className="uk-width-expand uk-padding-small uk-padding-remove-vertical uk-flex uk-flex-column uk-margin-medium-bottom"
            >
              <CurrentFilters
                numberOfResults={numberOfResults}
                filters={filters}
                resetFilters={resetFilters}
              />
              <FiltersSideBar
                filterData={OPPORTUNITY_FILTERS_DATA}
                filters={filters}
                setFilters={setFilters}
              />
            </div>
            <Filter
              loading={loading}
              filters={tabFilters}
              setFilters={setTabFilters}
            >
              {candidatId && (
                <CandidatOpportunityList
                  candidatId={candidatId}
                  filters={filters}
                  updateNumberOfResults={setNumberOfResults}
                />
              )}
            </Filter>
            <div />
          </>
        )}
      </Section>
    </LayoutBackOffice>
  );
};
export default Opportunites;
