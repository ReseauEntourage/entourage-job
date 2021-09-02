import React, { useState } from 'react';
import PropTypes from 'prop-types';
import OpportunityList from 'src/components/opportunities/OpportunityList';
import { OPPORTUNITY_FILTERS_DATA } from 'src/constants';
import { useFilters } from 'src/hooks';
import SearchBar from 'src/components/filters/SearchBar';

const CandidatOpportunities = ({ candidatId }) => {
  const [search, setSearch] = useState();

  const {
    filters,
    setFilters,
    numberOfResults,
    setNumberOfResults,
    resetFilters,
  } = useFilters(OPPORTUNITY_FILTERS_DATA);

  return (
    <div>
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
      <OpportunityList
        search={search}
        userRole="candidateAsAdmin"
        candidatId={candidatId}
        filters={filters}
        updateNumberOfResults={setNumberOfResults}
      />
    </div>
  );
};

CandidatOpportunities.propTypes = {
  candidatId: PropTypes.string.isRequired,
};

CandidatOpportunities.defaultProps = {};

export default CandidatOpportunities;
