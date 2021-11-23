import React from 'react';
import PropTypes from 'prop-types';
import OpportunityList from 'src/components/opportunities/OpportunityList';
import { OPPORTUNITY_FILTERS_DATA } from 'src/constants';
import { useFilters } from 'src/hooks';

const CandidatOpportunities = ({ candidatId }) => {
  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    OPPORTUNITY_FILTERS_DATA,
    {
      href: '/backoffice/admin/membres/[memberId]/[tab]',
      as: `/backoffice/admin/membres/${candidatId}/offres`,
    },
    ['memberId', 'tab']
  );

  return (
    <div>
      <OpportunityList
        candidatId={candidatId}
        search={search}
        filters={filters}
        resetFilters={resetFilters}
        setSearch={setSearch}
        setFilters={setFilters}
        userRole="candidateAsAdmin"
      />
    </div>
  );
};

CandidatOpportunities.propTypes = {
  candidatId: PropTypes.string.isRequired,
};

CandidatOpportunities.defaultProps = {};

export default CandidatOpportunities;
