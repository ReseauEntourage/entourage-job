/* global UIkit */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {Button, GridNoSSR, IconNoSSR} from '../utils';
import { CandidatCard } from '../cards';
import Api from '../../Axios';
import {FILTERS_DATA} from "../../constants";
import {hasAsChild, mutateFormSchema} from "../../utils";
import StepperModal from "../modals/StepperModal";
import FormWithValidation from "../forms/FormWithValidation";
import {useResetForm} from "../../hooks";
import schema from "../forms/schema/formEditOpportunity";


const CVList = ({ nb, search, filters, updateNumberOfResults }) => {
  const [cvs, setCVs] = useState(undefined);
  const [filteredCvs, setFilteredCvs] = useState(undefined);
  const [error, setError] = useState(undefined);

  const [form, resetForm] = useResetForm();

  const mutatedSchema = mutateFormSchema(schema, [
    {
      fieldId: 'candidatId',
      props: [
        {
          propName: 'disabled',
          value: true
        },
        {
          propName: 'hidden',
          value: true
        }
      ]
    },
    {
      fieldId: 'isPublic',
      props: [
        {
          propName: 'disabled',
          value: true
        },
        {
          propName: 'hidden',
          value: true
        }
      ]
    },
  ]);

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

  const filterCvs = (filtersObj) => {
    let filteredList = cvs;

    if(cvs && filtersObj) {
      const keys = Object.keys(filtersObj);

      if(keys.length > 0) {
        const totalFilters = keys.reduce((acc, curr) => {
          return acc + filtersObj[curr].length;
        }, 0);

        if(totalFilters > 0) {
          filteredList = cvs.filter((cv) => {
            const resultForEachFilter = [];
            for(let i = 0; i < keys.length; i += 1) {
              const currentFilterConstants = FILTERS_DATA.find((data) => data.key === keys[i]).constants;

              let hasFound = false;
              if(filtersObj[keys[i]].length === 0) {
                hasFound = true;
              }
              else if(cv[keys[i]].length > 0) {
                hasFound = filtersObj[keys[i]].some((currentFilter) => {
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

    return filteredList;
  };

  useEffect(() => {
    setFilteredCvs(undefined);
    setError(undefined);

    setFilteredCvs(filterCvs(filters));

  }, [filters, cvs]);

  useEffect(() => {
    if(filteredCvs) {
      updateNumberOfResults(filteredCvs.length);
    }
  }, [filteredCvs]);

  const renderCvList = (items) => {
    return (
      <div className="cv-list" uk-scrollspy="cls:uk-animation-slide-bottom-small; target: .uk-card; delay: 50">
        <GridNoSSR
          childWidths={['1-1', '1-2@s', '1-3@m']}
          gap="small"
          row
          center
          items={items.map((cv) => {
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
    )
  };

  if (error) {
    return <p className="uk-text-center uk-text-italic">{error}</p>;
  }

  if (cvs && filteredCvs) {
    if (filteredCvs.length <= 0) {
      if(filters && filters[FILTERS_DATA[1].key] && filters[FILTERS_DATA[1].key].length > 0) {

        const noCvsAreaMessage = (
          <p className="uk-text-center uk-text-italic">LinkedOut se déploie d’ici mars 2023 dans les régions de Paris, de Lille et de Lyon. Vous ne trouvez pas de candidats LinkedOut dans votre région ? Contactez-nous à{' '}
            <a
              className="uk-link-text uk-text-primary"
              target='_blank'
              rel="noopener noreferrer"
              href={`mailto:${process.env.MAILJET_CONTACT_EMAIL}`}>
              {process.env.MAILJET_CONTACT_EMAIL}
            </a>
          </p>
        );

        if(filters[FILTERS_DATA[0].key] && filters[FILTERS_DATA[0].key].length > 0) {
          const filteredOtherCvs = filterCvs({
            ...filters,
            [FILTERS_DATA[0].key]: []
          });

          if(filteredOtherCvs && filteredOtherCvs.length > 0) {
            return (
              <div>
                <p className="uk-text-center uk-text-italic">Nous n’avons aucun résultat pour votre recherche. Voici d’autres candidats dans la zone géographique sélectionné qui pourraient correspondre.</p>
                <p className="uk-text-center uk-text-italic uk-margin-medium-bottom">Vous êtes recruteur&nbsp;?{' '}
                  <a
                    style={{
                      textDecoration: 'underline'
                    }}
                    className="uk-link-text"
                    data-uk-toggle="#modal-offer-add-search">
                    Publier une offre d’emploi
                  </a> qui sera visible par tous les candidats LinkedOut, certains pourraient être intéressés&nbsp;!{' '}
                </p>
                {renderCvList(filteredOtherCvs)}
                <StepperModal
                  id="modal-offer-add-search"
                  title="Proposer une opportunité"
                  resetForm={resetForm}
                  composers={[
                    (closeModal, nextStep) => (
                      <div>
                        <p>
                          Cet espace est dédié aux potentiels recruteurs qui souhaitent
                          proposer une opportunité visible par tous les candidats.
                        </p>
                        <FormWithValidation
                          ref={form}
                          submitText="Envoyer"
                          formSchema={mutatedSchema}
                          onCancel={closeModal}
                          onSubmit={(opportunity) => {
                            Api.post('/api/v1/opportunity/', {
                              ...opportunity,
                              date: Date.now()
                            })
                              .then(nextStep)
                              .catch((err) => {
                                console.error(err);
                                UIkit.notification(
                                  "Une erreur s'est produite lors de l'envoie de l'offre",
                                  {pos: 'bottom-center', status: 'danger'}
                                );
                              });
                          }}
                          defaultValues={{
                            isPublic: true
                          }}
                        />
                      </div>
                    ),
                    (closeModal) => (
                      <div className="uk-flex uk-flex-center uk-margin-large">
                        <div className="uk-card uk-card-body uk-text-center">
                          <IconNoSSR name="check" ratio={4} className="uk-text-primary" />
                          <p className="uk-text-lead">
                            Merci pour votre offre, nous reviendrons bientôt vers vous.
                          </p>
                          <div className="uk-flex uk-flex-center">
                            <Button
                              style="secondary"
                              onClick={closeModal}
                            >
                              Fermer
                            </Button>
                          </div>
                        </div>
                      </div>
                    ),
                  ]}
                />
              </div>
            )
          }
        }

        return noCvsAreaMessage;
      }

      return (
        <p className="uk-text-center uk-text-italic">Aucun CV trouvé</p>
      );
    }
    return renderCvList(filteredCvs);
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
