import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CandidatOpportunityList from './CandidatOpportunityList';
import CurrentFilters from '../filters/CurrentFilters';
import FiltersSideBar from '../filters/FiltersSideBar';
import { initializeFilters } from '../../utils';
import { OPPORTUNITY_FILTERS_DATA } from '../../constants';

const CandidatOpportunities = ({ candidatId }) => {
  const [filters, setFilters] = useState(
    initializeFilters(OPPORTUNITY_FILTERS_DATA)
  );
  const [numberOfResults, setNumberOfResults] = useState(0);

  const resetFilters = () => {
    setFilters(initializeFilters(OPPORTUNITY_FILTERS_DATA));
  };

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
