import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CandidatOpportunityList from './CandidatOpportunityList';
import CurrentFilters from '../filters/CurrentFilters';
import FiltersSideBar from '../filters/FiltersSideBar';
import { OPPORTUNITY_FILTERS_DATA } from '../../constants';
import { useOpportunitiesFilters } from '../../hooks';

const CandidatOpportunities = ({ candidatId }) => {
  const {
    filters,
    setFilters,
    numberOfResults,
    setNumberOfResults,
    resetFilters,
  } = useOpportunitiesFilters();

  return (
    <div>
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
      <CandidatOpportunityList
        isAdmin
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
