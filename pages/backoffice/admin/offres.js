/* global UIkit */
import React, { useState, useContext, useRef } from 'react';
import OpportunityList from '../../../components/opportunities/OpportunityList';
import { mutateFormSchema } from '../../../utils';
import LayoutBackOffice from '../../../components/backoffice/LayoutBackOffice';
import { Button, Section } from '../../../components/utils';
import HeaderBackoffice from '../../../components/headers/HeaderBackoffice';
import Filter from '../../../components/utils/Filter';
import Axios from '../../../Axios';
import schema from '../../../components/forms/schema/formEditOpportunity';
import { UserContext } from '../../../components/store/UserProvider';
import ModalEdit from '../../../components/modals/ModalEdit';

import {
  OFFER_ADMIN_FILTERS_DATA,
  OPPORTUNITY_FILTERS_DATA,
} from '../../../constants';
import CurrentFilters from '../../../components/filters/CurrentFilters';
import FiltersSideBar from '../../../components/filters/FiltersSideBar';
import { useFilters } from '../../../hooks';

const LesOpportunites = () => {
  const { user } = useContext(UserContext);

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

  const [search, setSearch] = useState();

  const opportunityListRef = useRef();

  const postOpportunity = async (opportunity, closeModal) => {
    try {
      await Axios.post(`/api/v1/opportunity/`, opportunity);
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
        <Filter
          filters={tabFilters}
          setFilters={setTabFilters}
          search={(text) => {
            return setSearch(text);
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
        </Filter>
      </Section>
    </LayoutBackOffice>
  );
};
export default LesOpportunites;
