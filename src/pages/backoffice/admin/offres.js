/* global UIkit */

import React, { useContext, useEffect, useRef, useState } from 'react';
import OpportunityList from 'src/components/opportunities/OpportunityList';
import { initializeFilters, mutateFormSchema } from 'src/utils';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import { Button, Section } from 'src/components/utils';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import Filter from 'src/components/utils/Filter';
import Api from 'src/Axios';
import schema, {
  adminMutation,
} from 'src/components/forms/schema/formEditOpportunity';
import { UserContext } from 'src/components/store/UserProvider';
import ModalEdit from 'src/components/modals/ModalEdit';

import {
  OFFER_ADMIN_FILTERS_DATA,
  OPPORTUNITY_FILTERS_DATA,
} from 'src/constants';
import { useFilters } from 'src/hooks';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { usePrevious } from 'src/hooks/utils';
import SearchBar from 'src/components/filters/SearchBar';
import { IconNoSSR } from 'src/components/utils/Icon';

const LesOpportunites = () => {
  const { user } = useContext(UserContext);
  const [loadingDefaultFilters, setLoadingDefaultFilters] = useState(true);
  const prevUser = usePrevious(user);

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
    adminMutation,
  ]);

  const [search, setSearch] = useState();

  const opportunityListRef = useRef();

  const postOpportunity = async (opportunity, closeModal) => {
    try {
      await Api.post(`/api/v1/opportunity/`, opportunity);
      closeModal();
      UIkit.notification(`L'opportunité a été ajoutée.`, 'success');
      opportunityListRef.current.fetchData();
    } catch (err) {
      UIkit.notification(`Une erreur est survenue.`, 'danger');
    }
  };

  const [tabFilters, setTabFilters] = useState(OFFER_ADMIN_FILTERS_DATA);

  const {
    filters,
    setFilters,
    numberOfResults,
    setNumberOfResults,
    resetFilters,
  } = useFilters(OPPORTUNITY_FILTERS_DATA);

  useEffect(() => {
    if (user && user !== prevUser) {
      if (user.zone) {
        const defaultDepartmentsForAdmin = DEPARTMENTS_FILTERS.filter(
          (dept) => {
            return user.zone === dept.zone;
          }
        );

        setFilters(
          initializeFilters(OPPORTUNITY_FILTERS_DATA, {
            [OPPORTUNITY_FILTERS_DATA[2].key]: [...defaultDepartmentsForAdmin],
          })
        );
      } else {
        setFilters(initializeFilters(OPPORTUNITY_FILTERS_DATA));
      }
      setLoadingDefaultFilters(false);
    }
  }, [prevUser, setFilters, user]);

  if (!user) return null;

  return (
    <LayoutBackOffice title="Modération des offres d'emploi">
      <Section>
        <HeaderBackoffice
          title="Modération des offres d'emploi"
          description="Ici vous pouvez accéder à toutes les opportunités et valider les offres envoyées par les recruteurs !"
        >
          <Button style="primary" toggle="target: #add-opportunity">
            <IconNoSSR
              name="plus"
              ratio="0.8"
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
        <Filter
          filters={tabFilters}
          setFilters={setTabFilters}
          otherFilterComponent={
            <SearchBar
              filtersConstants={OPPORTUNITY_FILTERS_DATA}
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
          {!loadingDefaultFilters ? (
            <OpportunityList
              ref={opportunityListRef}
              search={search}
              tabFilter={
                tabFilters.find((filter) => {
                  return filter.active;
                }).tag
              }
              filters={filters}
              userRole="admin"
              updateNumberOfResults={setNumberOfResults}
            />
          ) : (
            <div className="uk-height-small uk-flex uk-flex-center uk-flex-middle">
              <div data-uk-spinner="" />
            </div>
          )}
        </Filter>
      </Section>
    </LayoutBackOffice>
  );
};
export default LesOpportunites;
