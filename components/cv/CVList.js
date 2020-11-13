import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, GridNoSSR } from '../utils';
import { CandidatCard } from '../cards';
import Api from '../../Axios';
import {CV_FILTERS_DATA, INITIAL_NB_OF_CV_TO_DISPLAY} from '../../constants';
import { hasAsChild } from '../../utils';
import PostJobAdModal from '../modals/PostJobAdModal';
import SimpleLink from '../utils/SimpleLink';

const NoCVInThisArea = () => (
  <p className="uk-text-center uk-text-italic">
    LinkedOut se déploie d’ici mars 2023 dans les régions de Paris, de Lille et
    de Lyon. Vous ne trouvez pas de candidats LinkedOut dans votre région&nbsp;?
    Contactez-nous à{' '}
    <SimpleLink
      isExternal
      newTab
      className="uk-link-text uk-text-primary"
      href={`mailto:${process.env.MAILJET_CONTACT_EMAIL}`}
    >
      {process.env.MAILJET_CONTACT_EMAIL}
    </SimpleLink>
  </p>
);

const CVList = ({
  nb,
  search,
  filters,
  updateNumberOfResults,
  hideEmployed,
}) => {
  const [cvs, setCVs] = useState(undefined);
  const [filteredCvs, setFilteredCvs] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [nbOfCVToDisplay, setNbOfCVToDisplay] = useState(
    INITIAL_NB_OF_CV_TO_DISPLAY
  );

  const displayMoreCVs = () =>
    setNbOfCVToDisplay(nbOfCVToDisplay + INITIAL_NB_OF_CV_TO_DISPLAY);

  useEffect(() => {
    setCVs(undefined);
    setError(undefined);
    Api.get(`/api/v1/cv/cards/random`, {
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

  const filterCvs = (filtersObj) => {
    let filteredList = cvs;

    if (cvs && filtersObj) {
      const keys = Object.keys(filtersObj);

      if (keys.length > 0) {
        const totalFilters = keys.reduce((acc, curr) => {
          return acc + filtersObj[curr].length;
        }, 0);

        if (totalFilters > 0) {
          filteredList = cvs.filter((cv) => {
            const resultForEachFilter = [];
            for (let i = 0; i < keys.length; i += 1) {
              const currentFilterConstants = CV_FILTERS_DATA.find(
                (data) => data.key === keys[i]
              ).constants;

              let hasFound = false;
              if (filtersObj[keys[i]].length === 0) {
                hasFound = true;
              } else if (cv[keys[i]].length > 0) {
                hasFound = filtersObj[keys[i]].some((currentFilter) => {
                  return (
                    cv[keys[i]].findIndex((value) => {
                      const isInChildren = hasAsChild(
                        currentFilterConstants,
                        value,
                        currentFilter.value
                      );
                      return (
                        isInChildren ||
                        value
                          .toLowerCase()
                          .includes(currentFilter.value.toLowerCase())
                      );
                    }) >= 0
                  );
                });
              }
              resultForEachFilter.push(hasFound);
            }

            return resultForEachFilter.every((value) => value);
          });
        }
      }
    }

    if (filteredList && filteredList.length > 0 && hideEmployed) {
      filteredList = filteredList.filter((cv) => {
        return !cv.user.employed;
      });
    }

    return filteredList;
  };

  useEffect(() => {
    setFilteredCvs(undefined);
    setError(undefined);

    setNbOfCVToDisplay(INITIAL_NB_OF_CV_TO_DISPLAY);
    setFilteredCvs(filterCvs(filters));
  }, [hideEmployed, filters, cvs]);

  useEffect(() => {
    if (filteredCvs) {
      updateNumberOfResults(filteredCvs.length);
    }
  }, [filteredCvs]);

  const renderCvList = (items) => {
    return (
      <div
        className="cv-list"
        uk-scrollspy="cls:uk-animation-slide-bottom-small; target: .uk-card; delay: 50"
      >
        <GridNoSSR
          childWidths={['1-1', '1-2@s', '1-3@m']}
          gap="small"
          row
          center
          items={items.slice(0, nbOfCVToDisplay).map((cv) => {
            return (
              <CandidatCard
                url={cv.user.url}
                imgSrc={
                  (cv.urlImg && process.env.AWSS3_URL + cv.urlImg) || undefined
                }
                imgAlt={cv.user.candidat.firstName}
                firstName={cv.user.candidat.firstName}
                gender={cv.user.candidat.gender}
                ambitions={cv.ambitions}
                locations={cv.locations}
                skills={cv.skills}
                catchphrase={cv.catchphrase}
                employed={cv.user.employed}
                id={cv.user.candidat.id}
              />
            );
          })}
        />
        {items.length > nbOfCVToDisplay && (
          <div className="uk-flex uk-flex-center uk-margin-top">
            <Button style="primary" onClick={displayMoreCVs}>
              Voir plus
            </Button>
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return <p className="uk-text-center uk-text-italic">{error}</p>;
  }

  if (cvs && filteredCvs) {
    if (filteredCvs.length <= 0) {
      if (
        filters &&
        filters[CV_FILTERS_DATA[1].key] &&
        filters[CV_FILTERS_DATA[1].key].length > 0
      ) {
        if (
          filters[CV_FILTERS_DATA[0].key] &&
          filters[CV_FILTERS_DATA[0].key].length > 0
        ) {
          const filteredOtherCvs = filterCvs({
            ...filters,
            [CV_FILTERS_DATA[0].key]: [],
          });

          if (filteredOtherCvs && filteredOtherCvs.length > 0) {
            return (
              <div>
                <p className="uk-text-center uk-text-italic">
                  Nous n’avons aucun résultat pour votre recherche. Voici
                  d’autres candidats dans la zone géographique sélectionnée qui
                  pourraient correspondre.
                </p>
                <p className="uk-text-center uk-text-italic uk-margin-medium-bottom">
                  Vous êtes recruteur&nbsp;?{' '}
                  <a
                    style={{
                      textDecoration: 'underline',
                    }}
                    className="uk-link-text"
                    data-uk-toggle="#modal-offer-add-search"
                  >
                    Publier une offre d’emploi
                  </a>{' '}
                  qui sera visible par tous les candidats LinkedOut, certains
                  pourraient être intéressés&nbsp;!{' '}
                </p>
                {renderCvList(filteredOtherCvs)}
                <PostJobAdModal />
              </div>
            );
          }
        }

        return <NoCVInThisArea />;
      }

      return <p className="uk-text-center uk-text-italic">Aucun CV trouvé</p>;
    }
    return renderCvList(filteredCvs);
  }

  return (
    <div className="uk-text-center">
      <div data-uk-spinner />
    </div>
  );
};

CVList.propTypes = {
  nb: PropTypes.number,
  search: PropTypes.string,
  filters: PropTypes.shape(),
  updateNumberOfResults: PropTypes.func,
  hideEmployed: PropTypes.bool,
};

CVList.defaultProps = {
  nb: undefined,
  search: undefined,
  filters: undefined,
  updateNumberOfResults: () => {},
  hideEmployed: false,
};
export default CVList;
