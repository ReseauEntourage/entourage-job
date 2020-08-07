import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR } from '../utils';
import { CandidatCard } from '../cards';
import Api from '../../Axios';
import {FILTERS_DATA} from "../../constants";
import {hasAsChild} from "../../utils";


const CVList = ({ nb, search, filters, updateNumberOfResults }) => {
  const [cvs, setCVs] = useState(undefined);
  const [filteredCvs, setFilteredCvs] = useState(undefined);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    setCVs(undefined);
    setError(undefined);
    Api
      .get(`/api/v1/cv/cards/random`, {
        params: {
          q: search,
          nb,
        },
      })
      .then(({ data }) => setCVs(data))
      .catch((err) => {
        console.error(err);
        setError('Impossible de récupérer les CVs.');
      });
  }, [nb, search]);

  useEffect(() => {
    setFilteredCvs(undefined);
    setError(undefined);
    let filteredList = cvs;

    if(cvs && filters) {
      const keys = Object.keys(filters);

      if(keys.length > 0) {
        const totalFilters = keys.reduce((acc, curr) => {
          return acc + filters[curr].length;
        }, 0);

        if(totalFilters > 0) {
          filteredList = cvs.filter((cv) => {
            const resultForEachFilter = [];
            for(let i = 0; i < keys.length; i += 1) {
              const currentFilterConstants = FILTERS_DATA.find((data) => data.key === keys[i]).constants;

              let hasFound = false;
              if(filters[keys[i]].length === 0) {
                hasFound = true;
              }
              else if(cv[keys[i]].length > 0) {
                hasFound = filters[keys[i]].some((currentFilter) => {
                  return cv[keys[i]].findIndex((value) => {
                    const isInChildren = hasAsChild(currentFilterConstants, value, currentFilter.value);
                    return isInChildren || value.toLowerCase().includes(currentFilter.value.toLowerCase());
                  }) >= 0;
                });
              }
              resultForEachFilter.push(hasFound);
            }

            return resultForEachFilter.every((value) => value);
          });
        }
      }
    }

    setFilteredCvs(filteredList);

  }, [filters, cvs]);

  useEffect(() => {
    if(filteredCvs) {
      updateNumberOfResults(filteredCvs.length);
    }
  }, [filteredCvs]);

  if (error) {
    return <p className="uk-text-center uk-text-italic">{error}</p>;
  }

  if (cvs && filteredCvs) {
    if (filteredCvs.length <= 0) {
      return (
        <p className="uk-text-center uk-text-italic">Aucun CV trouvé</p>
      );
    }
    return (
      <div uk-scrollspy="cls:uk-animation-slide-bottom-small; target: .uk-card; delay: 50">
        <GridNoSSR
          childWidths={['1-1', '1-2@s', '1-3@m']}
          gap="small"
          row
          center
          items={filteredCvs.map((cv) => {
            return <CandidatCard
              url={cv.user.url}
              imgSrc={
                (cv.urlImg && process.env.AWSS3_URL + cv.urlImg) || undefined
              }
              imgAlt={cv.user.candidat.firstName}
              firstName={cv.user.candidat.firstName}
              gender={cv.user.candidat.gender}
              ambitions={cv.ambitions}
              businessLines={cv.businessLines}
              locations={cv.locations}
              skills={cv.skills}
              catchphrase={cv.catchphrase}
              employed={cv.user.employed}
              id={cv.user.candidat.id}
            />
          })}
        />
      </div>
    );
  }

  return (
    <div className="uk-text-center">
      <div data-uk-spinner="" />
    </div>
  );
};
CVList.propTypes = {
  nb: PropTypes.number,
  search: PropTypes.string,
  filters: PropTypes.shape(),
  updateNumberOfResults: PropTypes.func
};

CVList.defaultProps = {
  nb: undefined,
  search: undefined,
  filters: undefined,
  updateNumberOfResults: () => {}
};
export default CVList;
