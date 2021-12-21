import React from 'react';
import PropTypes from 'prop-types';
import CVList from 'src/components/cv/CVList';
import { Grid, Section } from 'src/components/utils';
import { CV_FILTERS_DATA } from 'src/constants';
import { useFilters } from 'src/hooks';

const SearchCandidates = ({ style }) => {
  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    CV_FILTERS_DATA,
    { href: '/candidats' }
  );

  return (
    <Section style={style}>
      <Grid
        gap="medium"
        column
        middle
        center
        eachWidths={['2-3@s', '1-1', '1-1']}
      >
        <div className="uk-text-center uk-margin-medium-bottom">
          <h2 className="uk-text-bold">
            Découvrez les <span className="uk-text-primary">candidats</span>
          </h2>
          <div>
            Découvrez ci-dessous les CV des candidats LinkedOut disponibles, et
            envoyez votre offre au profil qui correspond à vos besoins de
            recrutement.
          </div>
        </div>
        <CVList
          search={search}
          filters={filters}
          resetFilters={resetFilters}
          setSearch={setSearch}
          setFilters={setFilters}
        />
      </Grid>
    </Section>
  );
};

SearchCandidates.propTypes = {
  style: PropTypes.oneOf(['default', 'muted']),
};

SearchCandidates.defaultProps = {
  style: 'default',
};

export default SearchCandidates;
