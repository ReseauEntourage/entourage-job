/* global UIkit */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Api from '../../Axios';
import schema from '../forms/schema/formEditOpportunity';
import FormWithValidation from '../forms/FormWithValidation';
import { GridNoSSR, Button, SimpleLink, IconNoSSR } from '../utils';
import ButtonIcon from '../utils/ButtonIcon';
import { CloseButtonNoSSR } from '../utils/CloseButton';
import { translateCategory, OfferInfoContainer, List } from './ModalOffer';
import {useRemoveModal, useResetForm} from '../../hooks';
import {findOfferStatus, formatParagraph} from '../../utils';

const ModalOfferAdmin = ({ currentOffer, setCurrentOffer }) => {
  if (!currentOffer) {
    currentOffer = { userOpportunity: [], businessLines: [] };
  }
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form, resetForm] = useResetForm();

  // Fix because of bug where multiple modals with the same id are created
  useRemoveModal('modal-offer-admin');

  const updateOpportunity = async (opportunity) => {
    setError(false);
    setLoading(true);
    try {
      const { data } = await Api.put(`/api/v1/opportunity/`, opportunity);
      setCurrentOffer({...data});
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError(false);
    setIsEditing(false);
  }, [currentOffer]);

  const contentBuilder = () => {
    // error
    if (error) {
      return <div>Une erreur c&lsquo;est produite</div>;
    }

    // loading
    if (loading) {
      return (
        <div className="uk-height-medium uk-flex uk-flex-middle uk-flex-center">
          <div data-uk-spinner="" />
        </div>
      );
    }

    // edit
    if (isEditing) {
      return (
        <div>
          <h3>Modification de l&apos;offres d&apos;emploi</h3>
          <FormWithValidation
            ref={form}
            formSchema={schema}
            defaultValues={{
              ...currentOffer,
              candidatId:
                !currentOffer.isPublic &&
                currentOffer.userOpportunity &&
                currentOffer.userOpportunity[0] &&
                currentOffer.userOpportunity[0].User &&
                currentOffer.userOpportunity[0].User.firstName
                  ? {
                      value: currentOffer.userOpportunity[0].User.id,
                      label: `${currentOffer.userOpportunity[0].User.firstName} ${currentOffer.userOpportunity[0].User.lastName}`,
                    }
                  : undefined,
            }}
            onCancel={() => setIsEditing(false)}
            onSubmit={(fields) => {
              const tmpOpportunity = {
                ...currentOffer,
                ...fields,
              };
              if (fields.candidatId) {
                tmpOpportunity.candidatId = fields.candidatId.value
                  ? fields.candidatId.value
                  : fields.candidatId;
              }
              updateOpportunity(tmpOpportunity);
              setIsEditing(false);
            }}
            submitText="Mettre à jour"
          />
        </div>
      );
    }

    let userOpportunitiesList = currentOffer.currentUserOpportunity;
    if(currentOffer.isPublic && userOpportunitiesList) {
      if(!Array.isArray(userOpportunitiesList)) {
        userOpportunitiesList = [userOpportunitiesList];
      }
    }

    // view
    return (
      <div>
        <GridNoSSR gap="small" between middle eachWidths={['expand', 'auto']}>
          <GridNoSSR gap="collapse" column>
            <h3 className="uk-text-bold uk-margin-remove-bottom">
              {currentOffer.title}
            </h3>
            <span>{translateCategory(currentOffer.isPublic)}</span>
          </GridNoSSR>
          <List className="uk-iconnav uk-grid-medium">
            <ButtonIcon
              name="pencil"
              onClick={() => {
                setIsEditing(true);
              }}
            />
          </List>
        </GridNoSSR>
        <hr />
        <GridNoSSR className="uk-margin-bottom" eachWidths={['1-3@s', '2-3@s']}>
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
                return <div className={`uk-label${className}`}>{content}</div>;
              })()}
            </OfferInfoContainer>
            <OfferInfoContainer icon="hashtag" title="Entreprise">
              {currentOffer.company}
            </OfferInfoContainer>
            <OfferInfoContainer icon="user" title="Recruteur">
              {currentOffer.recruiterName}
              <SimpleLink
                href={`mailto:${currentOffer.recruiterMail}`}
                className="uk-link-muted"
                isExternal
                newTab
              >
                <span>
                  {currentOffer.recruiterMail}
                  &nbsp;
                </span>
                <IconNoSSR name="mail" ratio={0.8} />
              </SimpleLink>
              <SimpleLink
                href={`tel:${currentOffer.recruiterPhone}`}
                className="uk-link-muted"
                isExternal
                newTab
              >
                <span>
                  {currentOffer.recruiterPhone}
                  &nbsp;
                </span>
                <IconNoSSR name="phone" ratio={0.8} />
              </SimpleLink>
              <span className="uk-text-italic uk-text-small">
                offre soumise le{' '}
                {moment(currentOffer.date).format('DD/MM/YYYY')}
              </span>
            </OfferInfoContainer>
            <OfferInfoContainer icon="location" title={currentOffer.location} />
            {!currentOffer.isPublic && (
              <OfferInfoContainer icon="users" title="Candidat lié">
                {currentOffer.userOpportunity &&
                  currentOffer.userOpportunity.map(
                    ({ status, User: { firstName, lastName, id } }) => (
                      <div className="uk-flex uk-flex-column">
                        <SimpleLink
                          as={`/backoffice/admin/membres/${id}`}
                          href="/backoffice/admin/membres/[id]"
                          className="uk-link-muted"
                          target="_blank"
                        >
                        <span>
                          {`${firstName} ${lastName}`}
                          &nbsp;
                        </span>
                          <IconNoSSR name="link" ratio={0.8} />
                        </SimpleLink>
                        <span className={`uk-text-meta uk-text-${findOfferStatus(status).color}`}>{findOfferStatus(status).label}</span>
                      </div>
                    )
                  )}
              </OfferInfoContainer>
            )}
            {userOpportunitiesList && userOpportunitiesList.length > 0 &&
              <OfferInfoContainer icon="users" title={`Statut pour`}>
                <div className="uk-height-max-medium uk-overflow-auto">
                  {
                    userOpportunitiesList.map((userOpportunity, index) => (
                      <div key={userOpportunity.User.id + index} className="uk-flex uk-flex-column uk-margin-small-top">
                        <SimpleLink
                          as={`/backoffice/admin/membres/${userOpportunity.User.id}`}
                          href="/backoffice/admin/membres/[id]"
                          className="uk-link-muted"
                          target="_blank">
                          <span>
                           {`${userOpportunity.User.firstName} ${userOpportunity.User.lastName}`}
                            &nbsp;
                          </span>
                          <IconNoSSR name="link" ratio={0.8} />
                        </SimpleLink>
                        <span className={`uk-text-meta uk-text-italic uk-text-${findOfferStatus(userOpportunity.status).color}`}>{findOfferStatus(userOpportunity.status).label}</span>
                      </div>
                    ))
                  }
                </div>

              </OfferInfoContainer>
            }
          </GridNoSSR>
          <GridNoSSR gap="medium" childWidths={['1-1']}>
            <OfferInfoContainer icon="comment" title="Message">
              <div>
                {formatParagraph(currentOffer.description)}
              </div>
            </OfferInfoContainer>
            {
              currentOffer.prerequisites &&
              <OfferInfoContainer icon="check" title="Pré-requis">
                <div>
                  {formatParagraph(currentOffer.prerequisites)}
                </div>
              </OfferInfoContainer>
            }
            {currentOffer.businessLines && (
              <GridNoSSR gap="small">
                {currentOffer.businessLines.map((businessLine, index) => (
                  <Button key={index} disabled>
                    <span style={{ color: '#666' }}>{businessLine}</span>
                  </Button>
                ))}
              </GridNoSSR>
            )}
          </GridNoSSR>
        </GridNoSSR>
        <GridNoSSR className="uk-flex-right" gap="small" row>
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
      </div>
    );
  };

  // Modal
  return (
    <div id="modal-offer-admin" data-uk-modal="bg-close:false">
      <div
        className={`uk-modal-dialog uk-width-1-1 uk-width-3-4@m uk-width-2-3@l uk-width-1-2@xl ${
          currentOffer.isArchived && 'uk-light uk-background-secondary'
        }`}
      >
        <CloseButtonNoSSR
          className="uk-modal-close-default"
          onClick={() => {
            if (isEditing) {
              setIsEditing(false);
            }
            resetForm();
          }}
        />
        <div className="uk-modal-body">{contentBuilder()}</div>
      </div>
    </div>
  );
};
ModalOfferAdmin.propTypes = {
  currentOffer: PropTypes.shape({
    title: PropTypes.string,
    company: PropTypes.string,
    description: PropTypes.string,
    prerequisites: PropTypes.string,
    recruiterName: PropTypes.string,
    isPublic: PropTypes.bool,
    isArchived: PropTypes.bool,
    isValidated: PropTypes.bool,
    recruiterMail: PropTypes.string,
    recruiterPhone: PropTypes.string,
    businessLines: PropTypes.arrayOf(PropTypes.string),
    date: PropTypes.string,
    location: PropTypes.string,
    userOpportunity: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.string,
        bookmarked: PropTypes.string,
        note: PropTypes.string,
        archived: PropTypes.string,
      }),
    ),
    currentUserOpportunity: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape()), PropTypes.shape()]),
  }),
  setCurrentOffer: PropTypes.func.isRequired,
};
ModalOfferAdmin.defaultProps = {
  currentOffer: { userOpportunity: {}, businessLines: [] },
};

export default ModalOfferAdmin;
