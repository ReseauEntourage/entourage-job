import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import CVList from 'src/components/cv/CVList';
import { GridNoSSR, Section } from 'src/components/utils';
import { CV_FILTERS_DATA, STORAGE_KEYS } from 'src/constants';
import { DataContext } from 'src/components/store/DataProvider';
import { useFilters } from 'src/hooks';
import { useMount } from 'src/hooks/utils';
import SearchBar from 'src/components/filters/SearchBar';

const SearchCandidates = ({ defaultHideEmployed, style, isCompany }) => {
  const [loadingDefaultFilters, setLoadingDefaultFilters] = useState(true);

  const [search, setSearch] = useState();

  const { getData, storeData } = useContext(DataContext);

  const {
    filters,
    setFilters,
    numberOfResults,
    setNumberOfResults,
    resetFilters,
  } = useFilters(
    CV_FILTERS_DATA,
    defaultHideEmployed
      ? { [CV_FILTERS_DATA[0].key]: CV_FILTERS_DATA[0].constants }
      : null
  );

  useMount(() => {
    const storageItem = getData(
      isCompany
        ? STORAGE_KEYS.CV_FILTERS_COMPANY
        : STORAGE_KEYS.CV_FILTERS_PUBLIC
    );
    if (storageItem) {
      setFilters(storageItem);
    }
    setLoadingDefaultFilters(false);
  });

  useEffect(() => {
    storeData(
      isCompany
        ? STORAGE_KEYS.CV_FILTERS_COMPANY
        : STORAGE_KEYS.CV_FILTERS_PUBLIC,
      filters
    );
  }, [isCompany, filters, storeData]);

  return (
    <Section style={style}>
      <GridNoSSR
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
        <SearchBar
          filtersConstants={CV_FILTERS_DATA}
          filters={filters}
          numberOfResults={numberOfResults}
          resetFilters={resetFilters}
          search={search}
          setSearch={setSearch}
          setFilters={setFilters}
          placeholder="Chercher un secteur d’activité, une compétence, un profil..."
        />
        {!loadingDefaultFilters && (
          <CVList
            search={search}
            filters={filters}
            updateNumberOfResults={setNumberOfResults}
          />
        )}
      </GridNoSSR>
    </Section>
  );
};

SearchCandidates.propTypes = {
  defaultHideEmployed: PropTypes.bool,
  isCompany: PropTypes.bool,
  style: PropTypes.oneOf(['default', 'muted']),
};

SearchCandidates.defaultProps = {
  defaultHideEmployed: false,
  style: 'default',
  isCompany: false,
};

export default SearchCandidates;
