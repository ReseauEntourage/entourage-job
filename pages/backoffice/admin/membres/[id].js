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
import CVPageContent from '../../../../components/backoffice/cv/CVPageContent';
import CandidatHeader from '../../../../components/backoffice/cv/CandidatHeader';
import UserInformationCard from '../../../../components/cards/UserInformationCard';
import ButtonIcon from '../../../../components/utils/ButtonIcon';
import ModalEdit from '../../../../components/modals/ModalEdit';
import {USER_ROLES} from "../../../../constants";
import ToggleWithConfirmationModal
  from "../../../../components/backoffice/ToggleWithConfirmationModal";

const CVPage = () => {
  const [onglet, setOnglet] = useState('cv');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const {
    query: { id },
  } = useRouter();

  useEffect(() => {
    if (id) {
      setLoading(true);
      Api.get(`/api/v1/user/${id}`).then(({ data }) => {
        setUser(data);
        setLoading(false);
      });
    }
  }, [id]);

  const userToCoach = schemaEditUser.fields[
    schemaEditUser.fields.findIndex((field) => field.id === 'userToCoach')
  ];

  userToCoach.disabled = () => true;
  userToCoach.hidden = () => true;

  if (loading) {
    return (
      <LayoutBackOffice title="Chargement - Gestion des menmbres">
        <Section>
          <GridNoSSR column gap="large">
            <SimpleLink
              href="/backoffice/admin/membres"
              className="uk-link-reset"
            >
              <IconNoSSR name="chevron-left" />
              Retour à la liste
            </SimpleLink>
            <div>
              <div uk-spinner="" />
              <hr className="ent-divier-backoffice uk-margin-large-top " />
            </div>
          </GridNoSSR>
        </Section>
      </LayoutBackOffice>
    );
  }

  if (!user) {
    return (
      <LayoutBackOffice title="Page introuvable - Gestion des menmbres">
        <Section className="uk-text-center" size="large">
          <GridNoSSR column gap="large">
            <SimpleLink
              href="/backoffice/admin/membres"
              className="uk-link-reset"
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
    <LayoutBackOffice title={`${user.firstName} - Gestion des menmbres`}>
      <Section>
        <GridNoSSR column gap="large">
          <SimpleLink
            href={`/backoffice/admin/membres?role=${user.role}`}
            className="uk-link-reset"
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
            <li className={onglet === 'opportunity' ? 'uk-active' : ''}>
              <a
                aria-hidden="true"
                onClick={() => {
                  setOnglet('opportunity');
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
          {onglet === 'cv' && (
            <>
              {user.role === USER_ROLES.COACH &&
                (user.coach ? (
                  <CVPageContent candidatId={user.coach.candidat.id} />
                ) : (
                  <>
                    <h2 className="uk-text-bold">
                      <span className="uk-text-primary">Aucun candidat</span>{' '}
                      n&apos;est rattaché à ce compte coach.
                    </h2>
                    <p>
                      Il peut y avoir plusieurs raisons à ce sujet. Contacte
                      l&apos;équipe LinkedOut pour en savoir plus.
                    </p>
                  </>
                ))}
              {user.role === USER_ROLES.CANDIDAT && (
                <CVPageContent candidatId={user.id} />
              )}
            </>
          )}
          {onglet === 'settings' && (
            <GridNoSSR childWidths={['1-2@m']}>
              {(user.role === USER_ROLES.CANDIDAT || user.role === USER_ROLES.COACH) && (
                <GridNoSSR childWidths={['1-1']}>
                  {
                    user.candidat &&
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
                            .then(() =>
                              UIkit.notification(
                                'Le profil du candidat a été mis à jour !',
                                'success'
                              )
                            )
                            .catch(() =>
                              UIkit.notification('Une erreur est survenue', 'danger')
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
                            .then(() =>
                              UIkit.notification(
                                hidden
                                  ? 'Le CV est désormais masqué'
                                  : 'Le CV est désormais visible',
                                'success'
                              )
                            )
                            .catch(() =>
                              UIkit.notification(
                                'Une erreur est survenue lors du masquage du profil',
                                'danger'
                              )
                            )
                        }
                      />
                    </Card>
                  }
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
                        onClick={() =>
                          UIkit.modal(`#edit-user`).show()
                        }
                      />
                    </GridNoSSR>
                    {user ? (
                      <GridNoSSR column gap="small">
                        <GridNoSSR row gap="small">
                          <IconNoSSR name="user" style={{width: 20}} />
                          <span>{`${user.firstName} ${user.lastName}`}</span>
                        </GridNoSSR>
                        <GridNoSSR row gap="small">
                          <IconNoSSR name="gender" style={{width: 20}} />
                          <span>{`${user.gender === 0 ? 'Homme' : 'Femme'}`}</span>
                        </GridNoSSR>
                        <GridNoSSR row gap="small">
                          <IconNoSSR name="mail" style={{width: 20}} />
                          <span>{user.email}</span>
                        </GridNoSSR>
                        <GridNoSSR row gap="small">
                          <IconNoSSR name="phone" style={{width: 20}} />
                          {user.phone ? (
                            <span>{user.phone}</span>
                          ) : (
                            <span className="uk-text-italic">
                              Numéro de téléphone non renseigné
                            </span>
                          )}
                        </GridNoSSR>
                      </GridNoSSR>
                    ) : undefined}
                  </div>
                  <div>
                    <ModalEdit
                      id="edit-user"
                      formSchema={schemaEditUser}
                      title="Edition d'un membre"
                      description="Merci de modifier les informations que vous souhaitez concernant le membre"
                      submitText="Modifier le membre"
                      defaultValues={user}
                      onSubmit={async (fields, closeModal) => {
                        setLoadingPersonal(true);
                        if(fields.role !== user.role) {
                          try {
                            const data = await Api.put(`api/v1/user/candidat/${user.id}`, {
                              coachId: null,
                            });
                          } catch (e) {
                            throw new Error('erreur sur la modification de la liaison');
                          }
                        }
                        try {
                          const {data} = await Api.put(`api/v1/user/${user.id}`, fields);
                          if (data) {
                            closeModal();
                            UIkit.notification('Le membre a bien été modifié', 'success');
                            setUser(data);
                          }
                          else {
                            throw new Error('réponse de la requete vide');
                          }
                        } catch (error) {
                          setLoadingPersonal(false);
                          console.error(error);
                          if(error.response.status === 409) {
                            UIkit.notification(
                              "Cette adresse email est déjà utilisée",
                              'danger'
                            );
                          }
                          else {
                            UIkit.notification(
                              "Une erreur s'est produite lors de la modification du membre",
                              'danger'
                            );
                          }
                        }
                      }}
                    />
                  </div>
                </GridNoSSR>
              )}
              {
                (user.role === USER_ROLES.CANDIDAT || user.role === USER_ROLES.COACH) && (
                <UserInformationCard
                  user={user}
                  onChange={(data) => {
                    setUser(data);
                  }}
                />
              )}
            </GridNoSSR>
          )}
        </GridNoSSR>
      </Section>
    </LayoutBackOffice>
  );
};

export default CVPage;
