/* global UIkit */
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../../../components/store/UserProvider';
import LayoutBackOffice from '../../../components/backoffice/LayoutBackOffice';
import { Section } from '../../../components/utils';
import OfferCard from '../../../components/cards/OfferCard';
import HeaderBackoffice from '../../../components/headers/HeaderBackoffice';
import ModalOffer from '../../../components/modals/ModalOffer';
import Api from '../../../Axios';
import Filter from '../../../components/utils/Filter';
import { USER_ROLES } from '../../../constants';
import OpportunityError from '../../../components/opportunities/OpportunityError';

const tabFiltersConst = [
  { tag: 'all', title: 'Toutes les offres' },
  { tag: 'private', title: 'Offres du candidat', active: true },
  { tag: 'public', title: 'Offres générales' },
  { tag: 'archived', title: 'Offres archivées' },
];

const Opportunites = () => {
  const { user } = useContext(UserContext);

  const {
    query: { q: opportunityId },
  } = useRouter();

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

  const fetchData = async (userId) => {
    if (user) {
      setLoading(true);
      try {
        const { data } = await Api.get(
          `${process.env.SERVER_URL}/api/v1/opportunity/user/all/${userId}`
        );

        setOffers(data);
        return data;
      } catch (err) {
        console.error(err);
        setLoading(false);
        setHasError(true);
      }
    } else console.log('no user');
    return null;
  };

  const onClickOpportunityCard = async (offer) => {
    const opportunity = offer;
    // si jamais ouvert
    if (!opportunity.userOpportunity || !opportunity.userOpportunity.seen) {
      const { data } = await Api.post(
        `${process.env.SERVER_URL}/api/v1/opportunity/join`,
        {
          opportunityId: offer.id,
          userId: candidatId,
          seen: true,
        }
      );
      opportunity.userOpportunity = data;
      fetchData(candidatId);
    }
    setCurrentOffer({ ...opportunity });
    UIkit.modal('#modal-offer').show();
  };

  useEffect(() => {
    // récupére les offres et si id en url ouvre loffre en question
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
    };

    if (user) {
      const updatedFilterConsts = [...tabFiltersConst];
      updatedFilterConsts[1].title =
        user.role === USER_ROLES.CANDIDAT ? 'Mes offres' : 'Offres du candidat';
      setTabFilters(updatedFilterConsts);

      if (user.role === USER_ROLES.CANDIDAT) {
        setCandidatId(user.id);
        fetchAndAct(user.id);
      }
      if (user.role === USER_ROLES.COACH) {
        Api.get(`/api/v1/user/candidat/`, {
          params: {
            coachId: user.id,
          },
        })
          .then(({ data }) => {
            if (data) {
              setCandidatId(data.candidat.id);
              fetchAndAct(data.candidat.id);
            } else {
              setHasError(true);
            }
          })
          .catch(() => {
            return setHasError(true);
          });
      }
    }
  }, [user, opportunityId]);

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
            >
              {tabFilteredOffers && tabFilteredOffers.length > 0 ? (
                tabFilteredOffers.map((offer, i) => {
                  return (
                    <li key={i}>
                      <a
                        aria-hidden
                        role="button"
                        className="uk-link-reset"
                        onClick={() => {
                          return onClickOpportunityCard(offer);
                        }}
                      >
                        <OfferCard
                          title={offer.title}
                          from={offer.recruiterName}
                          shortDescription={offer.company}
                          date={offer.date}
                          isValidated={offer.isValidated}
                          isPublic={offer.isPublic}
                          userOpportunity={offer.userOpportunity}
                          archived={
                            offer.userOpportunity &&
                            offer.userOpportunity.archived
                          }
                          isNew={
                            !offer.userOpportunity ||
                            !offer.userOpportunity.seen
                          }
                          isStared={
                            offer.userOpportunity &&
                            offer.userOpportunity.bookmarked
                          }
                        />
                      </a>
                    </li>
                  );
                })
              ) : (
                <div className="uk-text-center uk-flex uk-flex-center uk-flex-1">
                  <p className="uk-text-italic">
                    Aucune offre d&apos;emploi dans cette catégorie.
                  </p>
                </div>
              )}
            </Filter>
            <div>
              <ModalOffer
                currentOffer={currentOffer}
                setCurrentOffer={(offer) => {
                  setCurrentOffer({ ...offer });
                  fetchData(candidatId);
                }}
              />
            </div>
          </>
        )}
      </Section>
    </LayoutBackOffice>
  );
};
export default Opportunites;
