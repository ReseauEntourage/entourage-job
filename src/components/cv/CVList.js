import _ from 'lodash';
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ButtonPost from 'src/components/backoffice/cv/ButtonPost';
import { filtersToQueryParams } from 'src/utils';
import { GridNoSSR } from 'src/components/utils';
import { CandidatCard } from 'src/components/cards';
import Api from 'src/Axios';
import { CV_FILTERS_DATA, INITIAL_NB_OF_CV_TO_DISPLAY } from 'src/constants';
import PostJobAdModal from 'src/components/modals/PostJobAdModal';
import SimpleLink from 'src/components/utils/SimpleLink';
import { usePrevious } from 'src/hooks/utils';

const NoCVInThisArea = () => {
  return (
    <p className="uk-text-center uk-text-italic">
      LinkedOut se déploie d’ici septembre 2021 dans les régions de Paris, de
      Lille et de Lyon. Vous ne trouvez pas de candidats LinkedOut dans votre
      région&nbsp;? Contactez-nous à{' '}
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
};

const CVList = ({ nb, search, filters, updateNumberOfResults }) => {
  const [cvs, setCVs] = useState(undefined);
  const [hasSuggestions, setHasSuggestions] = useState(false);

  const [error, setError] = useState(undefined);
  const defaultNbOfCVs = nb || INITIAL_NB_OF_CV_TO_DISPLAY;
  const [nbOfCVToDisplay, setNbOfCVToDisplay] = useState(defaultNbOfCVs);

  const displayMoreCVs = useCallback(() => {
    return setNbOfCVToDisplay(nbOfCVToDisplay + INITIAL_NB_OF_CV_TO_DISPLAY);
  }, [nbOfCVToDisplay]);

  const prevSearch = usePrevious(search);
  const prevFilters = usePrevious(filters);
  const prevNbOfCVToDisplay = usePrevious(nbOfCVToDisplay);

  const fetchData = useCallback(
    (isPagination) => {
      Api.get(`/api/v1/cv/cards/random`, {
        params: {
          q: search,
          nb: nbOfCVToDisplay,
          ...filtersToQueryParams(filters),
        },
      })
        .then(({ data }) => {
          setHasSuggestions(data.suggestions);
          setCVs((prevCVs = []) => {
            if (isPagination) {
              return [
                ...prevCVs,
                ..._.differenceWith(data.cvs, prevCVs, (cv1, cv2) => {
                  return cv1.id === cv2.id;
                }),
              ];
            }

            return data.cvs;
          });
        })
        .catch((err) => {
          console.error(err);
          setError('Impossible de récupérer les CVs.');
        });
    },
    [filters, nbOfCVToDisplay, search]
  );

  useEffect(() => {
    if (search !== prevSearch || filters !== prevFilters) {
      setError(undefined);
      setCVs(undefined);
      fetchData();
    } else if (
      nbOfCVToDisplay !== prevNbOfCVToDisplay &&
      nbOfCVToDisplay > defaultNbOfCVs
    ) {
      setError(undefined);
      fetchData(true);
    }
  }, [
    defaultNbOfCVs,
    fetchData,
    filters,
    nbOfCVToDisplay,
    prevFilters,
    prevNbOfCVToDisplay,
    prevSearch,
    search,
  ]);

  useEffect(() => {
    const hasFiltersActivated = Object.keys(filters).some((filter) => {
      return filters[filter].length > 0;
    });

    if (hasFiltersActivated && cvs) {
      updateNumberOfResults(cvs.length);
    }
  }, [cvs, filters, updateNumberOfResults]);

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
        {!nb && (
          <div className="uk-flex uk-flex-center uk-margin-top">
            <ButtonPost
              text="Voir plus"
              style="primary"
              action={async () => {
                displayMoreCVs();
              }}
            />
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return <p className="uk-text-center uk-text-italic">{error}</p>;
  }

  if (cvs && filters) {
    if (hasSuggestions) {
      return (
        <div>
          <p className="uk-text-center uk-text-italic">
            Nous n’avons aucun résultat pour votre recherche. Voici d’autres
            candidats dans la zone géographique sélectionnée qui pourraient
            correspondre.
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
          {renderCvList(cvs)}
          <PostJobAdModal />
        </div>
      );
    }

    if (cvs.length <= 0) {
      if (
        filters &&
        filters[CV_FILTERS_DATA[1].key] &&
        filters[CV_FILTERS_DATA[1].key].length > 0
      ) {
        return <NoCVInThisArea />;
      }
      return <p className="uk-text-center uk-text-italic">Aucun CV trouvé</p>;
    }
    return renderCvList(cvs);
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
};

CVList.defaultProps = {
  nb: undefined,
  search: undefined,
  filters: {},
  updateNumberOfResults: () => {},
};
export default CVList;
