import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { filtersToQueryParams } from '../../utils';
import { Button, GridNoSSR } from '../utils';
import { CandidatCard } from '../cards';
import Api from '../../Axios';
import { CV_FILTERS_DATA, INITIAL_NB_OF_CV_TO_DISPLAY } from '../../constants';
import PostJobAdModal from '../modals/PostJobAdModal';
import SimpleLink from '../utils/SimpleLink';

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
  const [nbOfCVToDisplay, setNbOfCVToDisplay] = useState(
    nb || INITIAL_NB_OF_CV_TO_DISPLAY
  );

  const displayMoreCVs = useCallback(() => {
    return setNbOfCVToDisplay(nbOfCVToDisplay + INITIAL_NB_OF_CV_TO_DISPLAY);
  }, [nbOfCVToDisplay]);

  const fetchData = useCallback(() => {
    setCVs(undefined);
    setError(undefined);
    Api.get(`/api/v1/cv/cards/random`, {
      params: {
        q: search,
        nbOfCVToDisplay,
        ...filtersToQueryParams(filters),
      },
    })
      .then(({ data }) => {
        setHasSuggestions(data.suggestions);
        return setCVs(data.cvs);
      })
      .catch((err) => {
        console.error(err);
        setError('Impossible de récupérer les CVs.');
      });
  }, [filters, nbOfCVToDisplay, search]);

  useEffect(() => {
    setError(undefined);
    fetchData();
  }, [filters, nb, search, fetchData]);

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
        {!nb && items.length > nbOfCVToDisplay && (
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
        filters[CV_FILTERS_DATA[2].key] &&
        filters[CV_FILTERS_DATA[2].key].length > 0
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
