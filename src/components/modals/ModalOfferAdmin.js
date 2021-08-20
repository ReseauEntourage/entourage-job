import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Api from 'src/Axios';
import schema, {
  adminMutation,
} from 'src/components/forms/schema/formEditOpportunity';
import FormWithValidation from 'src/components/forms/FormWithValidation';
import { GridNoSSR, Button, SimpleLink, IconNoSSR } from 'src/components/utils';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import { CloseButtonNoSSR } from 'src/components/utils/CloseButton';
import {
  translateCategory,
  OfferInfoContainer,
  List,
} from 'src/components/modals/ModalOffer';
import { useRemoveModal, useResetForm } from 'src/hooks/utils';

import { findOfferStatus, formatParagraph, mutateFormSchema } from 'src/utils';
import { OFFER_STATUS } from 'src/constants';

const ModalOfferAdmin = ({ currentOffer, setCurrentOffer }) => {
  if (!currentOffer) {
    currentOffer = { userOpportunity: [], businessLines: [] };
  }
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // desactivation du champ de disclaimer
  const mutatedSchema = mutateFormSchema(schema, [
    {
      fieldId: 'disclaimer',
      props: [
        {
          propName: 'hidden',
          value: true,
        },
      ],
    },
    adminMutation,
  ]);

  const [form, resetForm] = useResetForm();

  // Fix because of bug where multiple modals with the same id are created
  useRemoveModal('modal-offer-admin');

  const updateOpportunity = async (opportunity) => {
    setError(false);
    setLoading(true);
    try {
      const { data } = await Api.put(`/api/v1/opportunity/`, opportunity);
      setCurrentOffer({ ...data });
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const updateOpportunityUser = async (opportunityUser) => {
    await Api.put(
      `${process.env.SERVER_URL}/api/v1/opportunity/join`,
      opportunityUser
    );
    setCurrentOffer({ ...currentOffer });
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
            formSchema={mutatedSchema}
            defaultValues={{
              ...currentOffer,
              candidatesId:
                !currentOffer.isPublic &&
                currentOffer.userOpportunity &&
                currentOffer.userOpportunity.length > 0
                  ? currentOffer.userOpportunity.map((userOpp) => {
                      return {
                        value: userOpp.User.id,
                        label: `${userOpp.User.firstName} ${userOpp.User.lastName}`,
                      };
                    })
                  : undefined,
            }}
            onCancel={() => {
              return setIsEditing(false);
            }}
            onSubmit={(fields) => {
              const tmpOpportunity = {
                ...currentOffer,
                ...fields,
                candidatesId:
                  !fields.isPublic && fields.candidatesId
                    ? fields.candidatesId.map((candidateId) => {
                        return typeof candidateId === 'object'
                          ? candidateId.value
                          : candidateId;
                      })
                    : null,
              };
              updateOpportunity(tmpOpportunity);
              setIsEditing(false);
            }}
            submitText="Mettre à jour"
          />
        </div>
      );
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
                let content = 'À valider';
                if (currentOffer.isValidated) {
                  content = 'Publiée';
                  className = ' uk-label-success';
                }
                if (currentOffer.isArchived) {
                  content = 'Archivée';
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
            <OfferInfoContainer icon="location" title={currentOffer.location}>
              {currentOffer.department}
            </OfferInfoContainer>
            {currentOffer.userOpportunity && (
              <OfferInfoContainer
                icon="users"
                title={`${
                  currentOffer.isPublic ? 'Statut pour' : 'Candidat(s) lié(s)'
                }`}
              >
                <div className="uk-height-max-medium uk-overflow-auto">
                  {currentOffer.userOpportunity.map((userOpp) => {
                    return (
                      <div
                        className="uk-flex uk-flex-column"
                        style={{ marginTop: 5 }}
                      >
                        <SimpleLink
                          as={`/backoffice/admin/membres/${userOpp.User.id}`}
                          href="/backoffice/admin/membres/[id]"
                          className="uk-link-muted"
                          target="_blank"
                        >
                          <span>
                            {`${userOpp.User.firstName} ${userOpp.User.lastName}`}
                            &nbsp;
                          </span>
                          <IconNoSSR name="link" ratio={0.8} />
                        </SimpleLink>
                        <div uk-form-custom="target: true">
                          <select
                            className="uk-select"
                            onChange={(event) => {
                              setLoading(true);
                              const userOpportunity = userOpp;
                              userOpportunity.status = Number(
                                event.target.value
                              );
                              updateOpportunityUser(userOpportunity);
                              setLoading(false);
                            }}
                            value={userOpp.status}
                            style={{
                              height: 'auto',
                            }}
                          >
                            {OFFER_STATUS.map((item, i) => {
                              return (
                                <option value={item.value} key={i}>
                                  {item.label}
                                </option>
                              );
                            })}
                          </select>
                          <div className="uk-flex uk-flex-middle">
                            <span
                              className={`uk-text-meta uk-text-${
                                findOfferStatus(userOpp.status).color
                              }`}
                            >
                              {findOfferStatus(userOpp.status).label}
                            </span>
                            <IconNoSSR
                              ratio={0.8}
                              className="uk-margin-small-left uk-text-muted"
                              name="triangle-down"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </OfferInfoContainer>
            )}
          </GridNoSSR>
          <GridNoSSR gap="medium" childWidths={['1-1']}>
            <OfferInfoContainer icon="comment" title="Message">
              <div>{formatParagraph(currentOffer.description)}</div>
            </OfferInfoContainer>
            {currentOffer.prerequisites && (
              <OfferInfoContainer icon="check" title="Pré-requis">
                <div>{formatParagraph(currentOffer.prerequisites)}</div>
              </OfferInfoContainer>
            )}
            {currentOffer.businessLines && (
              <GridNoSSR gap="small">
                {currentOffer.businessLines.map((businessLine, index) => {
                  return (
                    <Button key={index} disabled>
                      <span style={{ color: '#666' }}>{businessLine}</span>
                    </Button>
                  );
                })}
              </GridNoSSR>
            )}
          </GridNoSSR>
        </GridNoSSR>
        <GridNoSSR className="uk-flex-right" gap="small" row>
          {!currentOffer.isArchived ? (
            <Button
              style="default"
              onClick={() => {
                return updateOpportunity({
                  ...currentOffer,
                  isValidated: false,
                  isArchived: true,
                });
              }}
            >
              Refuser l&apos;offre
            </Button>
          ) : (
            <Button
              style="default"
              onClick={() => {
                return updateOpportunity({
                  ...currentOffer,
                  isValidated: false,
                  isArchived: false,
                });
              }}
            >
              Retirer l&apos;offre des archives
            </Button>
          )}
          {!currentOffer.isValidated && (
            <Button
              style="primary"
              onClick={() => {
                return updateOpportunity({
                  ...currentOffer,
                  isValidated: true,
                  isArchived: false,
                });
              }}
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
    department: PropTypes.string,
    userOpportunity: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.string,
        bookmarked: PropTypes.string,
        note: PropTypes.string,
        archived: PropTypes.string,
        User: PropTypes.shape(),
      })
    ),
  }),
  setCurrentOffer: PropTypes.func.isRequired,
};
ModalOfferAdmin.defaultProps = {
  currentOffer: { userOpportunity: {}, businessLines: [] },
};

export default ModalOfferAdmin;
