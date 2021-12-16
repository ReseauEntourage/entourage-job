import React, { useRef, useState } from 'react';
import { usePostOpportunity } from 'src/hooks';
import { mutateFormSchema } from 'src/utils';
import schema, {
  adminMutation,
} from 'src/components/forms/schema/formEditOpportunity';
import { Button } from 'src/components/utils';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import { IconNoSSR } from 'src/components/utils/Icon';
import OpportunityList from 'src/components/opportunities/OpportunityList';
import PropTypes from 'prop-types';
import { OFFER_ADMIN_FILTERS_DATA } from 'src/constants';
import { openModal } from 'src/components/modals/Modal';

const AdminOpportunityList = ({
  search,
  filters,
  setFilters,
  setSearch,
  resetFilters,
}) => {
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

  const opportunityListRef = useRef();

  const { modal } = usePostOpportunity({
    defaultValues: {
      isPublic: true,
    },
    callback: opportunityListRef?.current?.fetchData,
    modalTitle: 'Ajouter une opportunité',
    schema: mutatedSchema,
  });

  const [tabFilters, setTabFilters] = useState(OFFER_ADMIN_FILTERS_DATA);

  return (
    <>
      <HeaderBackoffice
        title="Modération des offres d'emploi"
        description="Ici vous pouvez accéder à toutes les opportunités et valider les offres envoyées par les recruteurs !"
      >
        <Button
          style="primary"
          onClick={() => {
            openModal(modal);
          }}
        >
          <IconNoSSR
            name="plus"
            ratio="0.8"
            className="uk-margin-small-right"
          />
          Nouvelle opportunité
        </Button>
      </HeaderBackoffice>
      <OpportunityList
        ref={opportunityListRef}
        tabFilters={tabFilters}
        setTabFilters={setTabFilters}
        search={search}
        filters={filters}
        resetFilters={resetFilters}
        setSearch={setSearch}
        setFilters={setFilters}
        userRole="admin"
      />
    </>
  );
};

AdminOpportunityList.propTypes = {
  search: PropTypes.string,
  filters: PropTypes.shape(),
  setFilters: PropTypes.func,
  setSearch: PropTypes.func,
  resetFilters: PropTypes.func,
};

AdminOpportunityList.defaultProps = {
  search: undefined,
  filters: {},
  setFilters: () => {},
  setSearch: () => {},
  resetFilters: () => {},
};

export default AdminOpportunityList;
