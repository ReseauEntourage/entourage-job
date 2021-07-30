import React from 'react';
import PropTypes from 'prop-types';
import OpportunityList from './OpportunityList';
import CurrentFilters from '../filters/CurrentFilters';
import FiltersSideBar from '../filters/FiltersSideBar';
import { OPPORTUNITY_FILTERS_DATA } from '../../constants';
import { useFilters } from '../../hooks';

const CandidatOpportunities = ({ candidatId }) => {
  const {
    filters,
    setFilters,
    numberOfResults,
    setNumberOfResults,
    resetFilters,
  } = useFilters(OPPORTUNITY_FILTERS_DATA);

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
      <OpportunityList
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
