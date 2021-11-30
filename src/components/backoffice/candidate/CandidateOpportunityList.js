import React, { useContext, useEffect, useState } from 'react';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import { USER_ROLES, OFFER_CANDIDATE_FILTERS_DATA } from 'src//constants';
import OpportunityList from 'src/components/opportunities/OpportunityList';
import PropTypes from 'prop-types';

import { UserContext } from 'src/components/store/UserProvider';

const CandidateOpportunityList = ({
  search,
  filters,
  setFilters,
  setSearch,
  resetFilters,
  candidatId,
}) => {
  const { user } = useContext(UserContext);

  const [tabFilters, setTabFilters] = useState(OFFER_CANDIDATE_FILTERS_DATA);

  useEffect(() => {
    const updatedFilterConsts = [...OFFER_CANDIDATE_FILTERS_DATA];
    updatedFilterConsts[1].title =
      user.role === USER_ROLES.CANDIDAT ? 'Mes offres' : 'Offres du candidat';
    setTabFilters(updatedFilterConsts);
  }, [user.role]);

  return (
    <>
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
      <OpportunityList
        candidatId={candidatId}
        tabFilters={tabFilters}
        setTabFilters={setTabFilters}
        search={search}
        filters={filters}
        resetFilters={resetFilters}
        setSearch={setSearch}
        setFilters={setFilters}
        userRole="candidat"
      />
    </>
  );
};

CandidateOpportunityList.propTypes = {
  candidatId: PropTypes.string.isRequired,
  search: PropTypes.string,
  filters: PropTypes.shape(),
  setFilters: PropTypes.func,
  setSearch: PropTypes.func,
  resetFilters: PropTypes.func,
};

CandidateOpportunityList.defaultProps = {
  search: undefined,
  filters: {},
  setFilters: () => {},
  setSearch: () => {},
  resetFilters: () => {},
};

export default CandidateOpportunityList;
