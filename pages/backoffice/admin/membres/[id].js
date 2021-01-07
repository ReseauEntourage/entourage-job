/* global UIkit */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LayoutBackOffice from '../../../../components/backoffice/LayoutBackOffice';
import Api from '../../../../Axios';
import {
  Section,
  SimpleLink,
  GridNoSSR,
  IconNoSSR,
  Card,
} from '../../../../components/utils';
import schemaEditUser from '../../../../components/forms/schema/formEditUser';
import schemaDeleteUser from '../../../../components/forms/schema/formDeleteUser.json';
import CVPageContent from '../../../../components/backoffice/cv/CVPageContent';
import CandidatHeader from '../../../../components/backoffice/cv/CandidatHeader';
import UserInformationCard from '../../../../components/cards/UserInformationCard';
import ButtonIcon from '../../../../components/utils/ButtonIcon';
import ModalEdit from '../../../../components/modals/ModalEdit';
import { USER_ROLES } from '../../../../constants';
import ToggleWithConfirmationModal from '../../../../components/backoffice/ToggleWithConfirmationModal';
import { mutateFormSchema } from '../../../../utils';
import CandidatOpportunities from '../../../../components/opportunities/CandidatOpportunities';
import Button from '../../../../components/utils/Button';
import Icon from '../../../../components/utils/Icon';

const CVPage = () => {
  const [onglet, setOnglet] = useState('cv');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    query: { id },
    push,
  } = useRouter();

  const getUser = () => {
    Api.get(`/api/v1/user/${id}`)
      .then(({ data }) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      getUser();
    }
  }, [id]);

  useEffect(() => {
    if (onglet === 'settings') {
      getUser();
    }
  }, [onglet]);

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
  ]);

  const deleteUser = async (fields, closeModal) => {
    try {
      if (fields.confirmation === 'SUPPRIMER') {
        await Api.delete(`/api/v1/user/${id}`);
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

  if (loading) {
    return (
      <LayoutBackOffice title="Chargement - Gestion des membres">
        <Section>
          <GridNoSSR column gap="large">
            <SimpleLink
              href="/backoffice/admin/membres"
              className="uk-link-reset uk-flex uk-flex-middle"
            >
              <IconNoSSR name="chevron-left" />
              Retour à la liste
            </SimpleLink>
            <div>
              <div data-uk-spinner="" />
              <hr className="ent-divier-backoffice uk-margin-large-top " />
            </div>
          </GridNoSSR>
        </Section>
      </LayoutBackOffice>
    );
  }

  if (!user) {
    return (
      <LayoutBackOffice title="Page introuvable - Gestion des membres">
        <Section className="uk-text-center" size="large">
          <GridNoSSR column gap="large">
            <SimpleLink
              href="/backoffice/admin/membres"
              className="uk-link-reset uk-flex uk-flex-middle"
            >
              <IconNoSSR name="chevron-left" />
              Retour à la liste
            </SimpleLink>
            <div>
              <hr className="ent-divier-backoffice uk-margin-large-top " />
              <h2>Ce profil n’est pas disponible</h2>
              <p>
                Le lien que vous avez suivi est peut-être rompu, ou la page a
                été supprimée.
              </p>
            </div>
          </GridNoSSR>
        </Section>
      </LayoutBackOffice>
    );
  }

  return (
    <LayoutBackOffice title={`${user.firstName} - Gestion des membres`}>
      <Section>
        <GridNoSSR column gap="large">
          <SimpleLink
            href={`/backoffice/admin/membres?role=${user.role}`}
            className="uk-link-reset uk-flex uk-flex-middle"
          >
            <IconNoSSR name="chevron-left" />
            Retour à la liste
          </SimpleLink>
          <div>
            <CandidatHeader user={user} />
            <hr className="ent-divier-backoffice uk-margin-large-top " />
          </div>
          <ul className="uk-subnav">
            <li className={onglet === 'cv' ? 'uk-active' : ''}>
              <a
                aria-hidden="true"
                onClick={() => {
                  setOnglet('cv');
                }}
              >
                CV
              </a>
            </li>
            <li className={onglet === 'opportunities' ? 'uk-active' : ''}>
              <a
                aria-hidden="true"
                onClick={() => {
                  setOnglet('opportunities');
                }}
              >
                Opportunités
              </a>
            </li>
            <li className={onglet === 'settings' ? 'uk-active' : ''}>
              <a
                aria-hidden="true"
                onClick={() => {
                  setOnglet('settings');
                }}
              >
                Paramètres
              </a>
            </li>
          </ul>
          {onglet !== 'settings' &&
            user.role === USER_ROLES.COACH &&
            (user.coach ? (
              <div>
                {onglet === 'cv' && (
                  <CVPageContent candidatId={user.coach.candidat.id} />
                )}
                {onglet === 'opportunities' && (
                  <CandidatOpportunities candidatId={user.coach.candidat.id} />
                )}
              </div>
            ) : (
              <div>
                <h2 className="uk-text-bold">
                  <span className="uk-text-primary">Aucun candidat</span>{' '}
                  n&apos;est rattaché à ce compte coach.
                </h2>
                <p>
                  Il peut y avoir plusieurs raisons à ce sujet. Contacte
                  l&apos;équipe LinkedOut pour en savoir plus.
                </p>
              </div>
            ))}
          {onglet !== 'settings' && user.role === USER_ROLES.CANDIDAT && (
            <div>
              {onglet === 'cv' && <CVPageContent candidatId={user.id} />}
              {onglet === 'opportunities' && (
                <CandidatOpportunities candidatId={user.id} />
              )}
            </div>
          )}
          {onglet === 'settings' && (
            <GridNoSSR childWidths={['1-2@m']}>
              {(user.role === USER_ROLES.CANDIDAT ||
                user.role === USER_ROLES.COACH) && (
                /* TODO CHECK IF BUG COMES FROM HERE */
                <GridNoSSR
                  gap={isCandidat ? 'medium' : 'collapse'}
                  childWidths={['1-1']}
                >
                  <div>
                    {isCandidat && (
                      <Card title="Préférences du CV">
                        <ToggleWithConfirmationModal
                          id="employed"
                          title="A retrouvé un emploi"
                          modalTitle="Le candidat a retrouvé un emploi ?"
                          modalConfirmation="Oui, il a retrouvé un emploi"
                          defaultValue={user.candidat.employed}
                          onToggle={(employed) =>
                            Api.put(`/api/v1/user/candidat/${user.id}`, {
                              employed,
                            })
                              .then(() => {
                                setUser({
                                  ...user,
                                  candidat: {
                                    ...user.candidat,
                                    employed,
                                  },
                                });
                                UIkit.notification(
                                  'Le profil du candidat a été mis à jour !',
                                  'success'
                                );
                              })
                              .catch(() =>
                                UIkit.notification(
                                  'Une erreur est survenue',
                                  'danger'
                                )
                              )
                          }
                        />
                        <ToggleWithConfirmationModal
                          id="hidden"
                          title="Masquer le CV"
                          modalTitle="Changer la visibilité du CV en ligne ?"
                          modalConfirmation="Oui, masquer le CV"
                          defaultValue={user.candidat.hidden}
                          onToggle={(hidden) =>
                            Api.put(`/api/v1/user/candidat/${user.id}`, {
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
                              .catch(() =>
                                UIkit.notification(
                                  'Une erreur est survenue lors du masquage du profil',
                                  'danger'
                                )
                              )
                          }
                        />
                      </Card>
                    )}
                  </div>
                  <div className="uk-card uk-card-default uk-card-body">
                    <GridNoSSR
                      gap="small"
                      between
                      eachWidths={['expand', 'auto']}
                    >
                      <h3 className="uk-card-title">
                        Informations personnelles
                      </h3>
                      <ButtonIcon
                        name="pencil"
                        onClick={() => UIkit.modal(`#edit-user`).show()}
                      />
                    </GridNoSSR>
                    {user ? (
                      <GridNoSSR column gap="small">
                        <GridNoSSR row gap="small">
                          <IconNoSSR name="user" style={{ width: 20 }} />
                          <span>{`${user.firstName} ${user.lastName}`}</span>
                        </GridNoSSR>
                        <GridNoSSR row gap="small">
                          <IconNoSSR name="gender" style={{ width: 20 }} />
                          <span>
                            {`${user.gender === 0 ? 'Homme' : 'Femme'}`}
                          </span>
                        </GridNoSSR>
                        <GridNoSSR row gap="small">
                          <IconNoSSR name="mail" style={{ width: 20 }} />
                          <span>{user.email}</span>
                        </GridNoSSR>
                        <GridNoSSR row gap="small">
                          <IconNoSSR name="phone" style={{ width: 20 }} />
                          {user.phone ? (
                            <span>{user.phone}</span>
                          ) : (
                            <span className="uk-text-italic">
                              Numéro de téléphone non renseigné
                            </span>
                          )}
                        </GridNoSSR>
                        {user.role === USER_ROLES.CANDIDAT && (
                          <GridNoSSR row gap="small">
                            <IconNoSSR name="home" style={{ width: 20 }} />
                            {user.address ? (
                              <span>{user.address}</span>
                            ) : (
                              <span className="uk-text-italic">
                                Adresse postale non renseignée
                              </span>
                            )}
                          </GridNoSSR>
                        )}
                      </GridNoSSR>
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
                                await updateUser(() =>
                                  UIkit.modal(`#edit-user`).show()
                                );
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
                </GridNoSSR>
              )}
              <GridNoSSR childWidths={['1-1']} gap="medium">
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
                    onClick={() => UIkit.modal('#delete-user').show()}
                  >
                    <span className="uk-margin-small-right">
                      Supprimer l&apos;utilisateur
                    </span>
                    <Icon name="trash" />
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
              </GridNoSSR>
            </GridNoSSR>
          )}
        </GridNoSSR>
      </Section>
    </LayoutBackOffice>
  );
};

export default CVPage;
