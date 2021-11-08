import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Api from 'src/Axios';
import schema, {
  adminMutation,
} from 'src/components/forms/schema/formEditOpportunity';
import FormWithValidation from 'src/components/forms/FormWithValidation';
import { Button, CloseButton, Grid, SimpleLink } from 'src/components/utils';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import { IconNoSSR } from 'src/components/utils/Icon';

import {
  List,
  OfferInfoContainer,
  translateCategory,
} from 'src/components/modals/ModalOffer';
import { useRemoveModal, useResetForm } from 'src/hooks/utils';

import {
  findOfferStatus,
  formatParagraph,
  getUserOpportunityFromOffer,
  mutateFormSchema,
} from 'src/utils';
import { OFFER_STATUS } from 'src/constants';
import ContractLabel from 'src/components/backoffice/candidate/ContractLabel';

const ModalOfferAdmin = ({
  currentOffer,
  setCurrentOffer,
  navigateBackToList,
  selectedCandidateId,
}) => {
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
    {
      fieldId: 'openNewForm',
      props: [
        {
          propName: 'hidden',
          value: true,
        },
        {
          propName: 'disabled',
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
                message: fields.isPublic ? null : fields.message,
                startOfContract: fields.startOfContract || null,
                endOfContract: fields.endOfContract || null,
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

    const getUsersToShow = () => {
      if (Array.isArray(currentOffer.userOpportunity)) {
        if (selectedCandidateId) {
          return [
            getUserOpportunityFromOffer(currentOffer, selectedCandidateId),
          ];
        }
        if (currentOffer.isPublic) {
          return currentOffer.userOpportunity.filter((userOpp) => {
            return userOpp.status !== OFFER_STATUS[0].value;
          });
        }
        return currentOffer.userOpportunity;
      }
      return [currentOffer.userOpportunity];
    };

    const mutatedOfferStatus = [
      {
        ...OFFER_STATUS[0],
        label: currentOffer.isPublic
          ? OFFER_STATUS[0].alt
          : OFFER_STATUS[0].label,
      },
      ...OFFER_STATUS.slice(1),
    ];

    // view
    return (
      <div>
        <Grid gap="small" between middle eachWidths={['expand', 'auto']}>
          <Grid gap="collapse" column>
            <h3 className="uk-text-bold uk-margin-remove-bottom">
              {currentOffer.title}
            </h3>
            <span>{translateCategory(currentOffer.isPublic)}</span>
            <ContractLabel
              contract={currentOffer.contract}
              endOfContract={currentOffer.endOfContract}
              startOfContract={currentOffer.startOfContract}
            />
            <span className="uk-text-small">
              {currentOffer.numberOfPositions} poste
              {currentOffer.numberOfPositions > 1 ? 's' : ''} -{' '}
              {currentOffer.isPartTime ? 'Temps partiel' : 'Temps plein'}
            </span>
            <span className="uk-text-italic uk-text-small">
              offre soumise le {moment(currentOffer.date).format('DD/MM/YYYY')}
            </span>
          </Grid>
          <div>
            <div className="uk-margin-small-top uk-margin-small-bottom">
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
            </div>
            <List className="uk-iconnav uk-flex-right">
              <ButtonIcon
                name="pencil"
                onClick={() => {
                  setIsEditing(true);
                }}
              />
            </List>
          </div>
        </Grid>
        <hr />
        {currentOffer.message && (
          <>
            <Grid>
              <OfferInfoContainer icon="commenting">
                <div>{formatParagraph(currentOffer.message)}</div>
              </OfferInfoContainer>
            </Grid>
            <hr />
          </>
        )}
        <Grid className="uk-margin-bottom" eachWidths={['1-3@s', '2-3@s']}>
          <Grid column gap="medium">
            <OfferInfoContainer icon="home" title="Entreprise">
              {currentOffer.company}
            </OfferInfoContainer>
            <OfferInfoContainer icon="user" title="Recruteur">
              <span>
                {currentOffer.recruiterFirstName} {currentOffer.recruiterName}
              </span>
              <span className="uk-text-muted">
                {currentOffer.recruiterPosition}
              </span>
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
              {currentOffer.beContacted && (
                <span>Souhaite être recontacté</span>
              )}
            </OfferInfoContainer>
            <OfferInfoContainer
              icon="location"
              title={currentOffer.department}
            />
            {currentOffer.userOpportunity && (
              <OfferInfoContainer
                icon="users"
                title={`${
                  currentOffer.isPublic ? 'Statut pour' : 'Candidat(s) lié(s)'
                }`}
              >
                <div className="uk-height-max-medium uk-overflow-auto">
                  {getUsersToShow().map((userOpp) => {
                    if (userOpp.User) {
                      const offerStatus = findOfferStatus(userOpp.status);

                      return (
                        <div
                          key={userOpp.OpportunityId + userOpp.User.id}
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
                              {mutatedOfferStatus.map((item, i) => {
                                return (
                                  <option value={item.value} key={i}>
                                    {item.label}
                                  </option>
                                );
                              })}
                            </select>
                            <div className="uk-flex uk-flex-middle">
                              <span
                                className={`uk-text-meta uk-text-${offerStatus.color}`}
                              >
                                {currentOffer.isPublic && offerStatus.alt
                                  ? offerStatus.alt
                                  : offerStatus.label}
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
                    }
                    return undefined;
                  })}
                </div>
              </OfferInfoContainer>
            )}
          </Grid>
          <Grid gap="medium" childWidths={['1-1']}>
            {currentOffer.companyDescription && (
              <OfferInfoContainer
                icon="comment"
                title="Description de l'entreprise"
              >
                <div>{formatParagraph(currentOffer.companyDescription)}</div>
              </OfferInfoContainer>
            )}
            <OfferInfoContainer icon="comment" title="Description de l'offre">
              <div>{formatParagraph(currentOffer.description)}</div>
            </OfferInfoContainer>
            <OfferInfoContainer icon="check" title="Compétences importantes">
              <div>{formatParagraph(currentOffer.skills)}</div>
            </OfferInfoContainer>
            {currentOffer.prerequisites && (
              <OfferInfoContainer icon="check" title="Pré-requis">
                <div>{formatParagraph(currentOffer.prerequisites)}</div>
              </OfferInfoContainer>
            )}
            {currentOffer.businessLines && (
              <Grid gap="small">
                {currentOffer.businessLines.map((businessLine, index) => {
                  return (
                    <Button key={index} disabled>
                      <span style={{ color: '#666' }}>{businessLine}</span>
                    </Button>
                  );
                })}
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid className="uk-flex-right" gap="small" row>
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
        </Grid>
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
        <CloseButton
          className="uk-modal-close-default"
          onClick={() => {
            if (isEditing) {
              setIsEditing(false);
            }
            resetForm();
            navigateBackToList();
          }}
        />
        <div className="uk-modal-body">{contentBuilder()}</div>
      </div>
    </div>
  );
};
ModalOfferAdmin.propTypes = {
  currentOffer: PropTypes.shape({
    message: PropTypes.string,
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
        status: PropTypes.number,
        bookmarked: PropTypes.bool,
        note: PropTypes.string,
        archived: PropTypes.bool,
        User: PropTypes.shape(),
      })
    ),
    companyDescription: PropTypes.string,
    skills: PropTypes.string,
    contract: PropTypes.string,
    endOfContract: PropTypes.string,
    startOfContract: PropTypes.string,
    isPartTime: PropTypes.bool,
    recruiterFirstName: PropTypes.string,
    recruiterPosition: PropTypes.string,
    numberOfPositions: PropTypes.number,
    beContacted: PropTypes.bool,
  }),
  setCurrentOffer: PropTypes.func.isRequired,
  navigateBackToList: PropTypes.func.isRequired,
  selectedCandidateId: PropTypes.string,
};
ModalOfferAdmin.defaultProps = {
  selectedCandidateId: undefined,
  currentOffer: { userOpportunity: {}, businessLines: [] },
};

export default ModalOfferAdmin;
