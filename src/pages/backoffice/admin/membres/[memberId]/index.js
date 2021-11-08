/* global UIkit */
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { usePrevious } from 'src/hooks/utils';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import Api from 'src/Axios';
import { Button, Card, Grid, Section, SimpleLink } from 'src/components/utils';
import schemaEditUser from 'src/components/forms/schema/formEditUser';
import schemaDeleteUser from 'src/components/forms/schema/formDeleteUser.json';
import CVPageContent from 'src/components/backoffice/cv/CVPageContent';
import CandidatHeader from 'src/components/backoffice/cv/CandidatHeader';
import UserInformationCard from 'src/components/cards/UserInformationCard';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import ModalEdit from 'src/components/modals/ModalEdit';
import { USER_ROLES } from 'src/constants';
import ToggleWithConfirmationModal from 'src/components/backoffice/ToggleWithConfirmationModal';
import { mutateFormSchema } from 'src/utils';
import CandidatOpportunities from 'src/components/opportunities/CandidatOpportunities';
import CandidateEmployedToggle from 'src/components/backoffice/candidate/CandidateEmployedToggle';
import ContractLabel from 'src/components/backoffice/candidate/ContractLabel';
import { IconNoSSR } from 'src/components/utils/Icon';

const CVPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    query: { memberId, tab, offerId },
    push,
  } = useRouter();

  useEffect(() => {
    if (memberId && !tab) {
      push(
        '/backoffice/admin/membres/[memberId]/[tab]',
        `/backoffice/admin/membres/${memberId}/cv`
      );
    } else if (offerId && tab !== 'offres') {
      push(
        '/backoffice/admin/membres/[memberId]/[tab]',
        `/backoffice/admin/membres/${memberId}/${tab}`
      );
    }
  }, [memberId, offerId, push, tab]);

  const prevId = usePrevious(memberId);

  const getUser = useCallback(() => {
    Api.get(`/api/v1/user/${memberId}`)
      .then(({ data }) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [memberId]);

  useEffect(() => {
    if (memberId !== prevId) {
      setLoading(true);
      getUser();
    } else if (tab === 'parametres') {
      getUser();
    }
  }, [tab, getUser, memberId, prevId]);

  let mutatedSchema = mutateFormSchema(schemaEditUser, [
    {
      fieldId: 'userToCoach',
      props: [
        {
          propName: 'disabled',
          value: true,
        },
        {
          propName: 'hidden',
          value: true,
        },
      ],
    },
    {
      fieldId: 'role',
      props: [
        {
          propName: 'hidden',
          value: true,
          option: USER_ROLES.ADMIN,
        },
      ],
    },
    {
      fieldId: 'adminRole',
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
  ]);

  const deleteUser = async (fields, closeModal) => {
    try {
      if (fields.confirmation === 'SUPPRIMER') {
        await Api.delete(`/api/v1/user/${memberId}`);
        closeModal();
        UIkit.notification("L'utilisateur a bien été supprimé", 'success');
        push('/backoffice/admin/membres');
      } else {
        throw new Error();
      }
    } catch {
      UIkit.notification('Une erreur est survenue', 'danger');
    }
  };

  if (user) {
    if (user.role !== USER_ROLES.CANDIDAT) {
      mutatedSchema = mutateFormSchema(mutatedSchema, [
        {
          fieldId: 'address',
          props: [
            {
              propName: 'disabled',
              value: true,
            },
            {
              propName: 'hidden',
              value: true,
            },
          ],
        },
        {
          fieldId: 'addressLabel',
          props: [
            {
              propName: 'disabled',
              value: true,
            },
            {
              propName: 'hidden',
              value: true,
            },
          ],
        },
      ]);
    }
    if (user.role === USER_ROLES.ADMIN) {
      mutatedSchema = mutateFormSchema(mutatedSchema, [
        {
          fieldId: 'phone',
          props: [
            {
              propName: 'disabled',
              value: true,
            },
            {
              propName: 'hidden',
              value: true,
            },
          ],
        },
        {
          fieldId: 'phoneLabel',
          props: [
            {
              propName: 'disabled',
              value: true,
            },
            {
              propName: 'hidden',
              value: true,
            },
          ],
        },
      ]);
    }
  }

  const isCandidat = user && user.candidat && user.role === USER_ROLES.CANDIDAT;

  if (loading || !tab) {
    return (
      <LayoutBackOffice title="Chargement - Gestion des membres">
        <Section>
          <Grid column gap="large">
            <SimpleLink
              href="/backoffice/admin/membres"
              className="uk-link-reset uk-flex uk-flex-middle"
            >
              <IconNoSSR name="chevron-left" />
              Retour à la liste
            </SimpleLink>
            <div>
              <div data-uk-spinner="" />
              <hr className="ent-divier-backoffice" />
            </div>
          </Grid>
        </Section>
      </LayoutBackOffice>
    );
  }

  if (!user) {
    return (
      <LayoutBackOffice title="Page introuvable - Gestion des membres">
        <Section className="uk-text-center" size="large">
          <Grid column gap="large">
            <SimpleLink
              href="/backoffice/admin/membres"
              className="uk-link-reset uk-flex uk-flex-middle"
            >
              <IconNoSSR name="chevron-left" />
              Retour à la liste
            </SimpleLink>
            <div>
              <hr className="ent-divier-backoffice" />
              <h2>Ce profil n’est pas disponible</h2>
              <p>
                Le lien que vous avez suivi est peut-être rompu, ou la page a
                été supprimée.
              </p>
            </div>
          </Grid>
        </Section>
      </LayoutBackOffice>
    );
  }

  return (
    <LayoutBackOffice title={`${user.firstName} - Gestion des membres`}>
      <Section>
        <Grid column gap="medium">
          <SimpleLink
            href={`/backoffice/admin/membres?role=${user.role}`}
            className="uk-link-reset uk-flex uk-flex-middle"
          >
            <IconNoSSR name="chevron-left" />
            Retour à la liste
          </SimpleLink>
          <div>
            <CandidatHeader user={user} showZone />
            <hr className="ent-divier-backoffice uk-margin-medium-top" />
          </div>
          <ul className="uk-subnav">
            <li className={tab === 'cv' ? 'uk-active' : ''}>
              <SimpleLink
                href="/backoffice/admin/membres/[memberId]/[tab]"
                as={`/backoffice/admin/membres/${memberId}/cv`}
              >
                CV
              </SimpleLink>
            </li>
            <li className={tab === 'offres' ? 'uk-active' : ''}>
              <SimpleLink
                href="/backoffice/admin/membres/[memberId]/[tab]"
                as={`/backoffice/admin/membres/${memberId}/offres`}
              >
                Opportunités
              </SimpleLink>
            </li>
            <li className={tab === 'parametres' ? 'uk-active' : ''}>
              <SimpleLink
                href="/backoffice/admin/membres/[memberId]/[tab]"
                as={`/backoffice/admin/membres/${memberId}/parametres`}
              >
                Paramètres
              </SimpleLink>
            </li>
          </ul>
          {tab !== 'parametres' &&
            user.role === USER_ROLES.COACH &&
            (user.coach ? (
              <div>
                {tab === 'cv' && (
                  <CVPageContent candidatId={user.coach.candidat.id} />
                )}
                {tab === 'offres' && (
                  <CandidatOpportunities candidatId={user.coach.candidat.id} />
                )}
              </div>
            ) : (
              <div>
                <h2 className="uk-text-bold uk-text-center">
                  <span className="uk-text-primary">Aucun candidat</span>{' '}
                  n&apos;est rattaché à ce compte coach.
                </h2>
                <p className="uk-text-center">
                  Il peut y avoir plusieurs raisons à ce sujet. Contacte
                  l&apos;équipe LinkedOut pour en savoir plus.
                </p>
              </div>
            ))}
          {tab !== 'parametres' && user.role === USER_ROLES.CANDIDAT && (
            <div>
              {tab === 'cv' && <CVPageContent candidatId={user.id} />}
              {tab === 'offres' && (
                <CandidatOpportunities candidatId={user.id} />
              )}
            </div>
          )}
          {tab === 'parametres' && (
            <Grid childWidths={['1-2@m']}>
              {(user.role === USER_ROLES.CANDIDAT ||
                user.role === USER_ROLES.COACH) && (
                /* TODO CHECK IF BUG COMES FROM HERE */
                <Grid
                  gap={isCandidat ? 'medium' : 'collapse'}
                  childWidths={['1-1']}
                >
                  <div>
                    {isCandidat && (
                      <Card title="Préférences du CV">
                        <CandidateEmployedToggle
                          id="employed"
                          title="A retrouvé un emploi"
                          modalTitle="Le candidat a retrouvé un emploi ?"
                          modalConfirmation="Valider"
                          defaultValue={user.candidat.employed}
                          notificationMessage="Le profil du candidat a été mis à jour !"
                          subtitle={
                            user &&
                            user.candidat && (
                              <ContractLabel
                                contract={user.candidat.contract}
                                endOfContract={user.candidat.endOfContract}
                              />
                            )
                          }
                          setData={(newData) => {
                            setUser({
                              ...user,
                              candidat: {
                                ...user.candidat,
                                ...newData,
                              },
                            });
                          }}
                          candidatId={user.id}
                        />
                        <ToggleWithConfirmationModal
                          id="hidden"
                          title="Masquer le CV"
                          modalTitle="Changer la visibilité du CV en ligne ?"
                          modalConfirmation="Oui, masquer le CV"
                          defaultValue={user.candidat.hidden}
                          onToggle={(hidden) => {
                            return Api.put(`/api/v1/user/candidat/${user.id}`, {
                              hidden,
                            })
                              .then(() => {
                                setUser({
                                  ...user,
                                  candidat: {
                                    ...user.candidat,
                                    hidden,
                                  },
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
                  </div>
                  <div className="uk-card uk-card-default uk-card-body">
                    <Grid gap="small" between eachWidths={['expand', 'auto']}>
                      <h3 className="uk-card-title">
                        Informations personnelles
                      </h3>
                      <ButtonIcon
                        name="pencil"
                        onClick={() => {
                          return UIkit.modal(`#edit-user`).show();
                        }}
                      />
                    </Grid>
                    {user ? (
                      <Grid column gap="small">
                        <Grid row gap="small" middle>
                          <IconNoSSR name="user" style={{ width: 20 }} />
                          <span>{`${user.firstName} ${user.lastName}`}</span>
                        </Grid>
                        <Grid row gap="small" middle>
                          <IconNoSSR name="gender" style={{ width: 20 }} />
                          <span>
                            {`${user.gender === 0 ? 'Homme' : 'Femme'}`}
                          </span>
                        </Grid>
                        <Grid row gap="small" middle>
                          <IconNoSSR name="mail" style={{ width: 20 }} />
                          <span>{user.email}</span>
                        </Grid>
                        <Grid row gap="small" middle>
                          <IconNoSSR name="phone" style={{ width: 20 }} />
                          {user.phone ? (
                            <span>{user.phone}</span>
                          ) : (
                            <span className="uk-text-italic">
                              Numéro de téléphone non renseigné
                            </span>
                          )}
                        </Grid>
                        {user.role === USER_ROLES.CANDIDAT && (
                          <Grid row gap="small" middle>
                            <IconNoSSR name="home" style={{ width: 20 }} />
                            {user.address ? (
                              <span>{user.address}</span>
                            ) : (
                              <span className="uk-text-italic">
                                Adresse postale non renseignée
                              </span>
                            )}
                          </Grid>
                        )}
                      </Grid>
                    ) : undefined}
                  </div>
                  <div>
                    <ModalEdit
                      id="edit-user"
                      formSchema={mutatedSchema}
                      title="Edition d'un membre"
                      description="Merci de modifier les informations que vous souhaitez concernant le membre."
                      submitText="Modifier le membre"
                      defaultValues={{
                        ...user,
                        gender: user.gender.toString(),
                      }}
                      onSubmit={async (fields, closeModal) => {
                        const updateUser = async (onError) => {
                          try {
                            const { data } = await Api.put(
                              `api/v1/user/${user.id}`,
                              {
                                ...fields,
                                email: fields.email.toLowerCase(),
                              }
                            );
                            if (data) {
                              closeModal();
                              UIkit.notification(
                                'Le membre a bien été modifié',
                                'success'
                              );
                              setUser(data);
                            } else {
                              throw new Error('réponse de la requete vide');
                            }
                          } catch (error) {
                            console.error(error);
                            if (onError) onError();
                            if (error.response.status === 409) {
                              UIkit.notification(
                                'Cette adresse email est déjà utilisée',
                                'danger'
                              );
                            } else {
                              UIkit.notification(
                                "Une erreur s'est produite lors de la modification du membre",
                                'danger'
                              );
                            }
                          }
                        };

                        if (fields.role !== user.role) {
                          UIkit.modal
                            .confirm(
                              "Attention, si vous modifiez le rôle d'un candidat, tout son suivi sera perdu et son CV sera dépublié. Êtes-vous sûr de vouloir continuer ?",
                              {
                                labels: {
                                  ok: 'Valider',
                                  cancel: 'Annuler',
                                },
                              }
                            )
                            .then(
                              async () => {
                                await updateUser(() => {
                                  return UIkit.modal(`#edit-user`).show();
                                });
                              },
                              () => {
                                UIkit.modal(`#edit-user`).show();
                              }
                            );
                        } else {
                          await updateUser();
                        }
                      }}
                    />
                  </div>
                </Grid>
              )}
              <Grid childWidths={['1-1']} gap="medium">
                {(user.role === USER_ROLES.CANDIDAT ||
                  user.role === USER_ROLES.COACH) && (
                  <UserInformationCard
                    isAdmin
                    user={user}
                    onChange={(data) => {
                      setUser(data);
                    }}
                  />
                )}
                <div className="uk-flex uk-flex-center">
                  <Button
                    style="danger"
                    size="large"
                    onClick={() => {
                      return UIkit.modal('#delete-user').show();
                    }}
                  >
                    <span className="uk-margin-small-right">
                      Supprimer l&apos;utilisateur
                    </span>
                    <IconNoSSR name="trash" />
                  </Button>
                  <ModalEdit
                    id="delete-user"
                    title="Supprimer un membre"
                    description="Attention, si vous supprimer ce membre, toutes les données qui lui sont associées seront définitivement perdues. Êtes-vous sûr de vouloir continuer ?"
                    submitText="Supprimer le membre"
                    formSchema={schemaDeleteUser}
                    onSubmit={deleteUser}
                  />
                </div>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Section>
    </LayoutBackOffice>
  );
};

export default CVPage;
