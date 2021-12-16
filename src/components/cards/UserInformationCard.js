/* global UIkit */
import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Card, Grid, SimpleLink } from 'src/components/utils';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import ModalEdit from 'src/components/modals/ModalEdit';
import schema from 'src/components/forms/schema/formEditLinkedUser';
import Api from 'src/Axios';
import { USER_ROLES } from 'src/constants';
import ToggleWithConfirmationModal from 'src/components/backoffice/ToggleWithConfirmationModal';
import CandidateEmployedToggle from 'src/components/backoffice/candidate/CandidateEmployedToggle';
import ContractLabel from 'src/components/backoffice/candidate/ContractLabel';
import { IconNoSSR } from 'src/components/utils/Icon';
import { openModal } from 'src/components/modals/Modal';

// userId du candidat ou coach lié
const UserInformationCard = ({ isAdmin, user, onChange }) => {
  // données du candidat ou coach lié
  const [linkedUser, setLinkedUser] = useState();
  const [userCandidat, setUserCandidat] = useState();

  const [loading, setLoading] = useState(false);

  const assignUser = (userToAssign) => {
    if (userToAssign.role === USER_ROLES.COACH) {
      if (userToAssign.coach) {
        setLinkedUser(userToAssign.coach.candidat);
        setUserCandidat(userToAssign.coach);
      } else {
        setLinkedUser(null);
        setUserCandidat(null);
      }
      // customisation du schema en fonction de l'utilisateur
      schema.fields[1].title = 'Candidat lié';
    }
    if (userToAssign.role === USER_ROLES.CANDIDAT) {
      if (userToAssign.candidat) {
        setLinkedUser(userToAssign.candidat.coach);
        setUserCandidat(userToAssign.candidat);
      } else {
        setLinkedUser(null);
        setUserCandidat(null);
      }
      schema.fields[1].title = 'Coach lié';
    }
  };

  useEffect(() => {
    if (user) {
      assignUser(user);
    }
  }, [user]);

  // si membre lié ou non
  const cardContent = linkedUser ? (
    <Grid column gap="small">
      <Grid row gap="small">
        <IconNoSSR name="user" />
        <span>{`${linkedUser.firstName} ${linkedUser.lastName}`}</span>
      </Grid>
      {!linkedUser.deletedAt && (
        <Grid column gap="small">
          <SimpleLink
            href={`mailto:${linkedUser.email}`}
            className="uk-link-muted"
            isExternal
          >
            <Grid row gap="small">
              <IconNoSSR name="mail" />
              <span>{linkedUser.email}</span>
            </Grid>
          </SimpleLink>
          {linkedUser.phone ? (
            <SimpleLink
              href={`tel:${linkedUser.phone}`}
              className="uk-link-muted"
              isExternal
            >
              <Grid row gap="small">
                <IconNoSSR name="phone" />
                <span>{linkedUser.phone}</span>
              </Grid>
            </SimpleLink>
          ) : (
            <Grid row gap="small">
              <IconNoSSR name="phone" />
              <span className="uk-text-italic">
                Numéro de téléphone non renseigné
              </span>
            </Grid>
          )}
          {user.role === USER_ROLES.COACH &&
            (linkedUser.address ? (
              <Grid row gap="small">
                <IconNoSSR name="home" />
                <span>{linkedUser.address}</span>
              </Grid>
            ) : (
              <Grid row gap="small">
                <IconNoSSR name="home" />
                <span className="uk-text-italic">
                  Adresse postale non renseignée
                </span>
              </Grid>
            ))}
          {user.role === USER_ROLES.COACH && userCandidat && (
            <SimpleLink
              className="uk-link-muted"
              target="_blank"
              href={`/cv/${userCandidat.url}`}
            >
              <Grid row gap="small">
                <IconNoSSR name="link" />
                <span className="uk-text-italic">{userCandidat.url}</span>
              </Grid>
            </SimpleLink>
          )}
          {isAdmin && user.role === USER_ROLES.COACH && userCandidat && (
            <Grid row gap="small">
              <IconNoSSR name="cog" />
              <span className="uk-text-italic">
                {userCandidat.hidden ? 'CV caché' : 'CV visible'}
              </span>
            </Grid>
          )}
          {isAdmin && user.role === USER_ROLES.COACH && userCandidat && (
            <Grid row gap="small">
              <IconNoSSR name="cog" />
              <span className="uk-text-italic">
                {userCandidat.employed
                  ? 'A retrouvé un emploi'
                  : "N'a pas retrouvé d'emploi"}
              </span>
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  ) : (
    <span className="uk-text-italic">Aucun membre lié</span>
  );

  return (
    <Grid
      gap={user.role === USER_ROLES.COACH ? 'medium' : 'collapse'}
      childWidths={['1-1']}
    >
      {!isAdmin &&
        userCandidat &&
        user.role === USER_ROLES.COACH &&
        !linkedUser.deletedAt && (
          <Card style="secondary" title="Préférences du CV">
            <CandidateEmployedToggle
              id="employedLinked"
              title="A retrouvé un emploi"
              modalTitle="Le candidat a retrouvé un emploi ?"
              modalConfirmation="Valider"
              defaultValue={userCandidat.employed}
              notificationMessage="Le profil du candidat a été mis à jour !"
              subtitle={
                userCandidat && (
                  <ContractLabel
                    contract={userCandidat.contract}
                    endOfContract={userCandidat.endOfContract}
                  />
                )
              }
              setData={(newData) => {
                setUserCandidat({
                  ...userCandidat,
                  ...newData,
                });
              }}
              candidatId={linkedUser.id}
            />
            <ToggleWithConfirmationModal
              id="hiddenLinked"
              title="Masquer le CV"
              modalTitle="Changer la visibilité du CV en ligne ?"
              modalConfirmation="Oui, masquer le CV"
              defaultValue={userCandidat.hidden}
              onToggle={(hidden) => {
                return Api.put(`/api/v1/user/candidat/${linkedUser.id}`, {
                  hidden,
                })
                  .then(() => {
                    setUserCandidat({
                      ...userCandidat,
                      hidden,
                    });
                    UIkit.notification(
                      hidden
                        ? 'Le CV est désormais masqué'
                        : 'Le CV est désormais visible',
                      'success'
                    );
                  })
                  .catch(() => {
                    return UIkit.notification(
                      'Une erreur est survenue lors du masquage du profil',
                      'danger'
                    );
                  });
              }}
            />
          </Card>
        )}
      <Card
        style="secondary"
        title={`Information du${
          user.role === USER_ROLES.COACH ? ' candidat' : ' coach'
        }`}
        badge={(() => {
          if (isAdmin) {
            if (loading) {
              return <div data-uk-spinner="ratio: .8" />;
            }
            return (
              <ButtonIcon
                name="pencil"
                onClick={() => {
                  openModal(
                    <ModalEdit
                      submitText="Envoyer"
                      title={
                        user.role === USER_ROLES.CANDIDAT
                          ? 'Bénévole coach lié'
                          : 'Candidat lié'
                      }
                      defaultValues={{
                        role:
                          user.role === USER_ROLES.COACH
                            ? USER_ROLES.CANDIDAT
                            : USER_ROLES.COACH,
                        linkedUser: linkedUser
                          ? {
                              value: linkedUser.id,
                              label: `${linkedUser.firstName} ${linkedUser.lastName}`,
                            }
                          : undefined,
                      }}
                      formSchema={schema}
                      onSubmit={({ linkedUser: linkedUserId }, closeModal) => {
                        setLoading(true);
                        let promise = null;
                        if (user.role === USER_ROLES.CANDIDAT) {
                          // on lui assigne ou eleve un coach
                          promise = Api.put(`api/v1/user/candidat/${user.id}`, {
                            coachId: linkedUserId || null,
                          });
                        }
                        if (user.role === USER_ROLES.COACH) {
                          // on l'assigne à un candidat
                          if (linkedUserId) {
                            promise = Api.put(
                              `api/v1/user/candidat/${linkedUserId}`,
                              {
                                coachId: user.id,
                              }
                            );
                          } else {
                            // on lui enleve son candidat
                            promise = Api.put(
                              `api/v1/user/candidat/${linkedUser.id}`,
                              {
                                coachId: null,
                              }
                            );
                          }
                        }
                        if (promise) {
                          promise
                            .then(() => {
                              return Api.get(`/api/v1/user/${user.id}`);
                            })
                            .then(({ data }) => {
                              closeModal();
                              assignUser(data);
                              onChange(data);
                              UIkit.notification(
                                'Le membre a bien été lié',
                                'success'
                              );
                            })
                            .catch((error) => {
                              console.error(error);
                              UIkit.notification(
                                "Une erreur c'est produite lors du lien etre les membres",
                                'danger'
                              );
                            })
                            .finally(() => {
                              return setLoading(false);
                            });
                        }
                      }}
                    />
                  );
                }}
              />
            );
          }
          return null;
        })()}
      >
        {cardContent}
      </Card>
    </Grid>
  );
};
UserInformationCard.propTypes = {
  isAdmin: PropTypes.bool,
  user: PropTypes.shape().isRequired,
  onChange: PropTypes.func,
};

UserInformationCard.defaultProps = {
  isAdmin: false,
  onChange: () => {},
};

export default UserInformationCard;
