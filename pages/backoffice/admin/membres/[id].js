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
} from '../../../../components/utils';
import schemaPersonalData from '../../../../components/forms/schema/formPersonalData.json';
import CVPageContent from '../../../../components/backoffice/cv/CVPageContent';
import CandidatHeader from '../../../../components/backoffice/cv/CandidatHeader';
import UserInformationCard from '../../../../components/cards/UserInformationCard';
import ButtonIcon from '../../../../components/utils/ButtonIcon';
import ModalEdit from '../../../../components/modals/ModalEdit';

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
              retour à la liste
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
              retour à la liste
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
            retour à la liste
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
              {user.role === 'Coach' &&
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
              {user.role === 'Candidat' && (
                <CVPageContent candidatId={user.id} />
              )}
            </>
          )}
          {onglet === 'settings' && (
            <GridNoSSR childWidths={['1-2@m']}>
              {/* todo: to component -> Informations personnelles */}
              {(user.role === 'Candidat' || user.role === 'Coach') && (
                <>
                  <div className="uk-card uk-card-default uk-card-body">
                    <GridNoSSR
                      gap="small"
                      between
                      eachWidths={['expand', 'auto']}
                    >
                      <h3 className="uk-card-title">
                        Informations personnelles
                      </h3>
                      {loadingPersonal ? (
                        <div data-uk-spinner="ratio: .8" />
                      ) : (
                        <ButtonIcon
                          name="pencil"
                          onClick={() =>
                            UIkit.modal(`#modal-personal-data`).show()
                          }
                        />
                      )}
                    </GridNoSSR>
                    {user ? (
                      <GridNoSSR column gap="small">
                        <GridNoSSR row gap="small">
                          <IconNoSSR name="user" />
                          <span>{`${user.firstName} ${user.lastName}`}</span>
                        </GridNoSSR>
                        <GridNoSSR row gap="small">
                          <IconNoSSR name="mail" />
                          <span>{user.email}</span>
                        </GridNoSSR>
                        <GridNoSSR row gap="small">
                          <IconNoSSR name="phone" />
                          {user.phone ? (
                            <span>{user.phone}</span>
                          ) : (
                            <span className="uk-text-italic">
                              Numéro de téléphone non renseigné
                            </span>
                          )}
                        </GridNoSSR>
                        {user.role === 'Candidat'? (
                          <GridNoSSR row gap="small">
                            <IconNoSSR name="cog" />
                            <span className="uk-text-italic">
                              {user.candidat.hidden ? 'CV caché' : 'CV visible'}
                            </span>
                          </GridNoSSR>
                        ): null}
                        {user.role === 'Candidat'? (
                          <GridNoSSR row gap="small">
                            <IconNoSSR name="cog" />
                            <span className="uk-text-italic">
                              {user.candidat.employed
                                ? 'A retrouvé un emploi'
                                : "N'a pas retrouvé d'emploi"}
                            </span>
                          </GridNoSSR>
                        ): null}
                      </GridNoSSR>
                    ) : (
                      undefined
                    )}
                  </div>
                  <ModalEdit
                    submitText="Envoyer"
                    id="modal-personal-data"
                    title="Édition - Informations personelles"
                    defaultValues={{ phone: user.phone }}
                    formSchema={schemaPersonalData}
                    onSubmit={({ phone, oldEmail, newEmail0, newEmail1 }) => {
                      if (phone !== user.phone) {
                        setLoadingPersonal(true);
                        Api.put(`/api/v1/user/${user.id}`, {
                          phone,
                        })
                          .then(() => {
                            setUser({ ...user, phone });
                            UIkit.notification(
                              'Votre numéro de téléphone a bien été mis à jour',
                              'success'
                            );
                          })
                          .catch((err) => {
                            console.error(err);
                            UIkit.notification(
                              "Une erreur c'est produite lors de la mise à jour de votre email",
                              'danger'
                            );
                          })
                          .finally(() => setLoadingPersonal(false));
                      }

                      if (user.email === oldEmail && newEmail0 === newEmail1) {
                        setLoadingPersonal(true);
                        Api.put(`/api/v1/user/${user.id}`, {
                          email: newEmail0,
                        })
                          .then(() => {
                            setUser({ ...user, email: newEmail0 });
                            UIkit.notification(
                              'Votre email a bien été mis à jour',
                              'success'
                            );
                          })
                          .catch((err) => {
                            console.error(err);
                            UIkit.notification(
                              "Une erreur c'est produite lors de la mise à jour de votre email",
                              'danger'
                            );
                          })
                          .finally(() => setLoadingPersonal(false));
                      }
                    }}
                  />
                </>
              )}
              {(user.role === 'Candidat' || user.role === 'Coach') && (
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
