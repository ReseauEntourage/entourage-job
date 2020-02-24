/* global UIkit */
import React, { useState, useEffect } from 'react';
import PropsType from 'prop-types';
import moment from 'moment';
import axios from '../../Axios';
import schema from '../forms/schema/formEditOpportunity';
import FormWithValidation from '../forms/FormWithValidation';
import { GridNoSSR, Button } from '../utils';
import ButtonIcon from '../utils/ButtonIcon';
import { CloseButtonNoSSR } from '../utils/CloseButton';
import { translateCategory, OfferInfoContainer, List } from './ModalOffer';

const ModalOfferAdmin = ({ currentOffer, setCurrentOffer }) => {
  if (!currentOffer) {
    currentOffer = { userOpportunity: {}, businessLines: [] };
  }

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const updateOpportunity = async (opportunity) => {
    setLoading(true);
    await axios.put(
      `${process.env.SERVER_URL}/api/v1/opportunity/`,
      opportunity
    );
    setCurrentOffer(opportunity);
    setLoading(false);
  };

  useEffect(() => {
    setIsEditing(false);
  }, [currentOffer]);

  return (
    <div id="modal-offer-admin" data-uk-modal="bg-close:false">
      <div
        className={`uk-modal-dialog uk-width-1-1 uk-width-3-4@m uk-width-2-3@l uk-width-1-2@xl ${currentOffer.isArchived &&
          'uk-light uk-background-secondary'}`}
      >
        <CloseButtonNoSSR className="uk-modal-close-default" />
        <div className="uk-modal-body">
          {loading ? (
            <div className="uk-height-medium uk-flex uk-flex-middle uk-flex-center">
              <div data-uk-spinner="" />
            </div>
          ) : (
            <>
              {isEditing ? (
                <div>
                  <h3>Modification de l&apos;offres d&apos;emploi</h3>
                  <FormWithValidation
                    formSchema={schema}
                    defaultValues={currentOffer}
                    onCancel={() => setIsEditing(false)}
                    onSubmit={(fields) => {
                      const tmpOpportunity = {
                        ...currentOffer,
                        ...fields,
                      };
                      updateOpportunity(tmpOpportunity);
                      setIsEditing(false);
                    }}
                    submitText="Mettre à jour"
                  />
                </div>
              ) : (
                <>
                  <GridNoSSR gap="small" between middle>
                    <GridNoSSR gap="collapse" column>
                      <h3 className="uk-text-bold uk-margin-remove-bottom">
                        {currentOffer.title}
                      </h3>
                      <span>{translateCategory(currentOffer.isPublic)}</span>
                    </GridNoSSR>
                    {!isEditing && (
                      <List className="uk-iconnav uk-grid-medium">
                        <ButtonIcon
                          name="pencil"
                          onClick={() => {
                            setIsEditing(true);
                          }}
                        />
                      </List>
                    )}
                  </GridNoSSR>
                  <hr />
                  <GridNoSSR
                    className="uk-margin-bottom"
                    eachWidths={['1-3@s', '2-3@s']}
                  >
                    <GridNoSSR column gap="medium">
                      <OfferInfoContainer>
                        {(() => {
                          let className = ' uk-label-warning';
                          let content = 'En attente';
                          if (currentOffer.isValidated) {
                            content = 'Validé';
                            className = ' uk-label-success';
                          }
                          if (currentOffer.isArchived) {
                            content = 'Archivé';
                            className = ' uk-label-danger';
                          }
                          return (
                            <div className={`uk-label${className}`}>
                              {content}
                            </div>
                          );
                        })()}
                      </OfferInfoContainer>
                      <OfferInfoContainer icon="hashtag" title="Entreprise">
                        {currentOffer.company}
                      </OfferInfoContainer>
                      <OfferInfoContainer icon="user" title="Recruteur">
                        {currentOffer.recruiterName}
                        {currentOffer.recruiterMail}
                        {currentOffer.recruiterPhone}
                        <span className="uk-text-italic">
                          offre soumise le{' '}
                          {moment(currentOffer.date).format('DD/MM/YYYY')}
                        </span>
                      </OfferInfoContainer>
                      <OfferInfoContainer
                        icon="location"
                        title={currentOffer.location}
                      />
                    </GridNoSSR>
                    <GridNoSSR gap="medium">
                      <OfferInfoContainer icon="comment" title="Message">
                        {currentOffer.description}
                      </OfferInfoContainer>
                      {currentOffer.businessLines && (
                        <GridNoSSR center>
                          {currentOffer.businessLines.map((businessLine) => (
                            <Button disabled>
                              <span style={{ color: '#666' }}>
                                {businessLine}
                              </span>
                            </Button>
                          ))}
                        </GridNoSSR>
                      )}
                    </GridNoSSR>
                  </GridNoSSR>
                </>
              )}

              {!isEditing && (
                <GridNoSSR className="uk-flex-right" row>
                  {!currentOffer.isArchived ? (
                    <Button
                      style="default"
                      onClick={() =>
                        updateOpportunity({
                          ...currentOffer,
                          isValidated: false,
                          isArchived: true,
                        })
                      }
                    >
                      Refuser l&apos;offre
                    </Button>
                  ) : (
                    <Button
                      style="default"
                      onClick={() =>
                        updateOpportunity({
                          ...currentOffer,
                          isValidated: false,
                          isArchived: false,
                        })
                      }
                    >
                      Retirer l&apos;offre des archives
                    </Button>
                  )}
                  {!currentOffer.isValidated && (
                    <Button
                      style="primary"
                      onClick={() =>
                        updateOpportunity({
                          ...currentOffer,
                          isValidated: true,
                          isArchived: false,
                        })
                      }
                    >
                      Valider l&apos;offre
                    </Button>
                  )}
                </GridNoSSR>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
ModalOfferAdmin.propTypes = {
  currentOffer: PropsType.shape({
    title: PropsType.string,
    company: PropsType.string,
    description: PropsType.string,
    recruiterName: PropsType.string,
    isPublic: PropsType.bool,
    isArchived: PropsType.bool,
    isValidated: PropsType.bool,
    recruiterMail: PropsType.string,
    recruiterPhone: PropsType.string,
    businessLines: PropsType.arrayOf(PropsType.string),
    date: PropsType.string,
    location: PropsType.string,
    userOpportunity: PropsType.shape({
      status: PropsType.string,
      bookmarked: PropsType.string,
      note: PropsType.string,
      archived: PropsType.string,
    }),
  }),
  setCurrentOffer: PropsType.func.isRequired,
};
ModalOfferAdmin.defaultProps = {
  currentOffer: { userOpportunity: {}, businessLines: [] },
};

export default ModalOfferAdmin;
