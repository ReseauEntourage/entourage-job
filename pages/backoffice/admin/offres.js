/* global UIkit */
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { initializeFilters, mutateFormSchema } from '../../../utils';
import LayoutBackOffice from '../../../components/backoffice/LayoutBackOffice';
import { Button, Section } from '../../../components/utils';
import OfferCard from '../../../components/cards/OfferCard';
import HeaderBackoffice from '../../../components/headers/HeaderBackoffice';
import ModalOfferAdmin from '../../../components/modals/ModalOfferAdmin';
import Filter from '../../../components/utils/Filter';
import Axios from '../../../Axios';
import schema from '../../../components/forms/schema/formEditOpportunity';
import { UserContext } from '../../../components/store/UserProvider';
import ModalEdit from '../../../components/modals/ModalEdit';

import { OPPORTUNITY_FILTERS_DATA } from '../../../constants';
import CurrentFilters from '../../../components/filters/CurrentFilters';
import FiltersSideBar from '../../../components/filters/FiltersSideBar';
import OpportunityError from '../../../components/opportunities/OpportunityError';

const tabFiltersConst = [
  { tag: 'all', title: 'Toutes les offres' },
  { tag: 'pending', title: 'Offres à valider', active: true },
  { tag: 'validated', title: 'Offres publiées' },
  { tag: 'archived', title: 'Offres archivées' },
];

const LesOpportunites = () => {
  const { user } = useContext(UserContext);

  const {
    query: { q: opportunityId },
  } = useRouter();

  // desactivation du champ de disclaimer
  const mutatedSchema = mutateFormSchema(schema, [
    {
      fieldId: 'disclaimer',
      props: [
        {
          propName: 'hidden',
          value: true,
        },
      ],
    },
  ]);

  const [currentOffer, setCurrentOffer] = useState(null);
  const [offers, setOffers] = useState(undefined);

  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async (query) => {
    if (user) {
      try {
        setLoading(true);
        const { data } = await Axios.get(
          `${process.env.SERVER_URL}/api/v1/opportunity/admin`,
          {
            params: {
              query,
            },
          }
        );
        setOffers(
          data.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          })
        );
        return data;
      } catch (err) {
        console.error(err);
        setLoading(false);
        setHasError(true);
      }
    }
    return null;
  };

  const postOpportunity = async (opportunity, closeModal) => {
    try {
      await Axios.post(`/api/v1/opportunity/`, opportunity);
      closeModal();
      UIkit.notification(`L'opportunité a été ajoutée.`, 'success');
      fetchData();
    } catch (err) {
      UIkit.notification(`Une erreur est survenue.`, 'danger');
    }
  };

  useEffect(() => {
    fetchData().then((data) => {
      if (data) {
        const offer = data.find((o) => {
          return o.id === opportunityId;
        });
        if (offer) {
          setCurrentOffer({ ...offer });
          UIkit.modal('#modal-offer-admin').show();
        }
      }
    });
  }, [user, opportunityId]);

  /* TAB FILTERS */

  const [tabFilteredOffers, setTabFilteredOffers] = useState(undefined);
  const [tabFilters, setTabFilters] = useState(tabFiltersConst);

  const tabFilterOffers = () => {
    let filteredList = offers;
    if (offers) {
      const activeFilter = tabFilters.find((filter) => {
        return filter.active;
      });
      filteredList = filteredList.filter((offer) => {
        switch (activeFilter.tag) {
          case tabFiltersConst[0].tag:
            return true;
          case tabFiltersConst[1].tag:
            return !offer.isValidated && !offer.isArchived;
          case tabFiltersConst[2].tag:
            return offer.isValidated && !offer.isArchived;
          case tabFiltersConst[3].tag:
            return offer.isArchived;
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

  /* END TAB FILTERS */

  /* STATUS FILTER */
  const [filteredOffers, setFilteredOffers] = useState(undefined);

  const [filters, setFilters] = useState(
    initializeFilters(OPPORTUNITY_FILTERS_DATA)
  );
  const [numberOfResults, setNumberOfResults] = useState(0);

  const resetFilters = () => {
    setFilters(initializeFilters(OPPORTUNITY_FILTERS_DATA));
  };

  const filterOffers = (filtersObj) => {
    let filteredList = tabFilteredOffers;

    if (tabFilteredOffers && filtersObj) {
      const keys = Object.keys(filtersObj);

      if (keys.length > 0) {
        const totalFilters = keys.reduce((acc, curr) => {
          return acc + filtersObj[curr].length;
        }, 0);

        if (totalFilters > 0) {
          filteredList = tabFilteredOffers.filter((offer) => {
            // TODO make generic if several filters
            const resultForEachFilter = [];
            for (let i = 0; i < keys.length; i += 1) {
              let hasFound = false;
              if (filtersObj[keys[i]].length === 0) {
                hasFound = true;
              } else if (keys[i] === OPPORTUNITY_FILTERS_DATA[1].key) {
                hasFound = filtersObj[keys[i]].some((currentFilter) => {
                  if (
                    offer.userOpportunity &&
                    offer.userOpportunity.length > 0
                  ) {
                    return offer.userOpportunity.some((userOpp) => {
                      return currentFilter.value === userOpp.status;
                    });
                  }

                  return false;
                });
              } else if (keys[i] === OPPORTUNITY_FILTERS_DATA[0].key) {
                hasFound = offer.isPublic;
              }
              resultForEachFilter.push(hasFound);
            }

            return resultForEachFilter.every((value) => {
              return value;
            });
          });
        }
      }
    }

    return filteredList;
  };

  useEffect(() => {
    setHasError(false);
    setLoading(true);
    setFilteredOffers(filterOffers(filters));
  }, [filters, tabFilteredOffers]);

  useEffect(() => {
    if (filteredOffers) {
      setNumberOfResults(filteredOffers.length);
      setLoading(false);
    }
  }, [filteredOffers]);

  /* END STATUS FILTER */

  if (!user) return null;

  return (
    <LayoutBackOffice title="Modération des offres d'emploi">
      <Section>
        <HeaderBackoffice
          title="Modération des offres d'emploi"
          description="Ici vous pouvez accéder à toutes les opportunités et valider les offres envoyées par les recruteurs !"
        >
          <Button style="primary" toggle="target: #add-opportunity">
            <span
              uk-icon="icon: plus; ratio:0.8"
              className="uk-margin-small-right"
            />
            Nouvelle opportunité
          </Button>
          <ModalEdit
            id="add-opportunity"
            title="Ajouter une opportunité"
            submitText="Envoyer"
            formSchema={mutatedSchema}
            defaultValues={{
              isPublic: true,
            }}
            onSubmit={(fields, closeModal) => {
              postOpportunity(
                {
                  ...fields,
                  isAdmin: true,
                  date: Date.now(),
                },
                closeModal
              );
            }}
          />
        </HeaderBackoffice>
        {hasError ? (
          <OpportunityError />
        ) : (
          <>
            <Filter
              loading={loading}
              filters={tabFilters}
              setFilters={setTabFilters}
              search={({ target: { value } }) => {
                fetchData(value);
              }}
              otherFilterComponent={
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
              }
            >
              {filteredOffers && filteredOffers.length > 0 ? (
                filteredOffers.map((offer, i) => {
                  return (
                    <li key={i}>
                      <a
                        aria-hidden
                        role="button"
                        className="uk-link-reset"
                        onClick={() => {
                          setCurrentOffer({
                            ...offer,
                          });
                          UIkit.modal('#modal-offer-admin').show();
                        }}
                      >
                        <OfferCard
                          title={offer.title}
                          from={offer.recruiterName}
                          shortDescription={offer.company}
                          date={offer.date}
                          archived={offer.isArchived}
                          isPublic={offer.isPublic}
                          isValidated={offer.isValidated}
                          userOpportunity={offer.userOpportunity}
                          isAdmin
                        />
                      </a>
                    </li>
                  );
                })
              ) : (
                <div className="uk-text-center uk-flex uk-flex-center uk-flex-1">
                  <p className="uk-text-italic">
                    {Object.values(filters).reduce((acc, curr) => {
                      return acc + curr.length;
                    }, 0) > 0
                      ? 'Aucun résultat.'
                      : "Aucune offre d'emploi."}
                  </p>
                </div>
              )}
            </Filter>
            <div>
              <ModalOfferAdmin
                currentOffer={currentOffer}
                setCurrentOffer={(offer) => {
                  setCurrentOffer({ ...offer });
                  fetchData();
                }}
              />
            </div>
          </>
        )}
      </Section>
    </LayoutBackOffice>
  );
};
export default LesOpportunites;
