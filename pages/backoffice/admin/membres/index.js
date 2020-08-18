/* global UIkit */
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { PropTypes } from 'prop-types';
import LayoutBackOffice from '../../../../components/backoffice/LayoutBackOffice';
import {Section, GridNoSSR, IconNoSSR} from '../../../../components/utils';
import HeaderBackoffice from '../../../../components/headers/HeaderBackoffice';
import axios from '../../../../Axios';
import ModalEdit from '../../../../components/modals/ModalEdit';
import schemaCreateUser from '../../../../components/forms/schema/formEditUser';
import ImgProfile from '../../../../components/headers/ImgProfile';
import {CV_STATUS, USER_ROLES} from "../../../../constants";
import Button from "../../../../components/utils/Button";

function translateStatusCV(status) {
  const cvStatus = CV_STATUS[status] ? CV_STATUS[status] : CV_STATUS.Unknown;
  return (
    <span className={`uk-text-${cvStatus.style}`}>
      {cvStatus.label}
    </span>
  );

}

const MembersAdmin = ({ query: { role } }) => {
  const [members, setMembers] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allLoaded, setAllLoaded] = useState(false);
  const [offset, setOffset] = useState(0);
  const LIMIT = 50;
  const router = useRouter();

  const fetchData = async (doReset, query) => {
    setLoading(true);
    setHasError(false);
    if (doReset) {
      setMembers([]);
    }
    try {
      const { data } = await axios.get('/api/v1/user/members', {
        params: {
          limit: LIMIT,
          offset: doReset ? 0 : offset,
          role,
          query,
        },
      });
      if (doReset) {
        setMembers(data);
        setOffset(LIMIT);
        setAllLoaded(false);
      } else {
        setMembers([...members, ...data]);
        setOffset(offset + LIMIT);
      }

      if (data.length < LIMIT) {
        setAllLoaded(true);
      }
    } catch (err) {
      console.error(err);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, [role]);

  return (
    <LayoutBackOffice title="Gestion des membres">
      <Section>
        <HeaderBackoffice
          title="Gestion des membres"
          description="Ici vous pouvez accéder à tous les profils des coachs et candidats afin d'effectuer un suivi individuel de leur avancée."
        >
          <Button
            style="primary"
            onClick={() => {
              UIkit.modal('#add-user').show();
            }}
          >
            <span
              uk-icon="icon: plus; ratio:0.8"
              className="uk-margin-small-right"
            />
            Nouveau membre
          </Button>
          <ModalEdit
            id="add-user"
            formSchema={schemaCreateUser}
            title="Création de membre"
            description="Merci de renseigner quelques informations afin de créer le membre"
            submitText="Créer le membre"
            onSubmit={async (fields, closeModal) => {
              try {
                const { data } = await axios.post('api/v1/user', fields);
                if (data) {
                  closeModal();
                  UIkit.notification('Le membre a bien été créé', 'success');
                  fetchData(true);
                } else {
                  throw new Error('réponse de la requete vide');
                }
              } catch (error) {
                console.error(error);
                if(error.response.status === 409) {
                  UIkit.notification(
                    "Cette adresse email est déjà utilisée",
                    'danger'
                  );
                }
                else {
                  UIkit.notification(
                    "Une erreur s'est produite lors de la création du membre",
                    'danger'
                  );
                }
              }
            }}
          />
        </HeaderBackoffice>
        {hasError ? (
          <Section className="uk-width-1-1">
            <div className=" uk-text-center uk-flex uk-flex-center">
              <div className="uk-width-xlarge">
                <h2 className="uk-margin-remove">
                  Les membres n&apos;ont pas pu etre chargés correctement.
                </h2>
                <p>
                  Contacte{' '}
                  <span className="uk-text-primary">
                    l&apos;équipe LinkedOut
                  </span>{' '}
                  pour en savoir plus.
                </p>
              </div>
            </div>
          </Section>
        ) : (
          <>
            <GridNoSSR eachWidths={['expand', 'auto']}>
              <ul className="uk-subnav">
                <li
                  className={
                    role !== USER_ROLES.CANDIDAT && role !== USER_ROLES.COACH ? 'uk-active' : ''
                  }
                >
                  <a
                    aria-hidden="true"
                    onClick={() =>
                      router.push({
                        pathname: '/backoffice/admin/membres',
                        query: { role: 'All' },
                      })
                    }
                  >
                    Tous les membres
                  </a>
                </li>
                <li className={role === USER_ROLES.CANDIDAT ? 'uk-active' : ''}>
                  <a
                    aria-hidden="true"
                    onClick={() =>
                      router.push({
                        pathname: '/backoffice/admin/membres',
                        query: { role: USER_ROLES.CANDIDAT },
                      })
                    }
                  >
                    Candidats
                  </a>
                </li>
                <li className={role === USER_ROLES.COACH ? 'uk-active' : ''}>
                  <a
                    aria-hidden="true"
                    onClick={() =>
                      router.push({
                        pathname: '/backoffice/admin/membres',
                        query: { role: USER_ROLES.COACH },
                      })
                    }
                  >
                    Coachs
                  </a>
                </li>
              </ul>
              <div className="uk-margin">
                <form className="uk-search uk-search-default">
                  <span data-uk-search-icon />
                  <input
                    className="uk-search-input"
                    type="search"
                    placeholder="Rechercher..."
                    onChange={({ target: { value } }) => {
                      fetchData(true, value);
                    }}
                  />
                </form>
              </div>
            </GridNoSSR>
            <div className="uk-overflow-auto uk-margin-top">
              <table className="uk-table uk-table-hover uk-table-middle uk-table-divider uk-table-responsive">
                <thead>
                  <tr>
                    <th className="">Membre</th>
                    {role === 'All' && <th className="uk-width-small">Role</th>}
                    {role === USER_ROLES.CANDIDAT && (
                      <>
                        <th className="uk-width-small">À retrouvé un emploi</th>
                        <th className="uk-width-small">Statut du dernier CV</th>
                        <th className="uk-width-small">CV masqué</th>
                      </>
                    )}
                    <th className="uk-table-shrink uk-text-nowrap">
                      Coach/Candidat associé
                    </th>
                    <th className="uk-table-shrink uk-text-nowrap">
                      Dernière connexion
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, key) => (
                    <tr key={key}>
                      <Link href={`/backoffice/admin/membres/${member.id}`}>
                        <a
                          className="uk-link-reset"
                          style={{
                            display: 'contents',
                            height: '100%',
                            width: '100%',
                          }}
                        >
                          <td>
                            <GridNoSSR row gap="small" middle>
                              <ImgProfile user={member} size={48} />
                              <GridNoSSR column gap="collapse">
                                <span className="uk-text-bold">
                                  {member.firstName} {member.lastName}
                                </span>
                                <span>{member.email}</span>
                              </GridNoSSR>
                            </GridNoSSR>
                          </td>
                          {role === 'All' && <td>{member.role}</td>}
                          {role === USER_ROLES.CANDIDAT && member.candidat && (
                            <>
                              <td>
                                <span className="uk-hidden@m">
                                  {member.candidat.employed
                                    ? 'A trouvé un emploi'
                                    : "En recherche d'emploi"}
                                </span>
                                {
                                  member.candidat.employed &&
                                  <IconNoSSR
                                    name='check'
                                    ratio={1.2}
                                    className="uk-text-primary uk-visible@m"
                                  />
                                }
                              </td>
                              <td>
                                {member.candidat &&
                                member.candidat.cvs &&
                                member.candidat.cvs.length > 0 ? (
                                  translateStatusCV(
                                    member.candidat.cvs[0].status
                                  )
                                ) : (
                                  <span className="uk-text-italic uk-text-danger">
                                    Aucun CV
                                  </span>
                                )}
                              </td>
                              <td>
                                <span className="uk-hidden@m">
                                  {member.candidat.hidden
                                    ? 'Masqué'
                                    : 'Visible'}
                                </span>
                                {
                                  member.candidat.hidden &&
                                  <IconNoSSR
                                    name='check'
                                    ratio={1.2}
                                    className="uk-text-primary uk-visible@m"
                                  />
                                }
                              </td>
                            </>
                          )}
                          {member.role === USER_ROLES.CANDIDAT && (
                            <td>
                              {member.candidat && member.candidat.coach ? (
                                `${member.candidat.coach.firstName} ${member.candidat.coach.lastName}`
                              ) : (
                                <span className="uk-text-italic">Non lié</span>
                              )}
                            </td>
                          )}
                          {member.role === USER_ROLES.COACH && (
                            <td>
                              {member.coach && member.coach.candidat ? (
                                `${member.coach.candidat.firstName} ${member.coach.candidat.lastName}`
                              ) : (
                                <span className="uk-text-italic">Non lié</span>
                              )}
                            </td>
                          )}
                          <td>
                            {member.lastConnection ? (
                              moment(member.lastConnection).format('DD/MM/YYYY')
                            ) : (
                              <span className="uk-text-italic">
                                Aucune connexion
                              </span>
                            )}
                          </td>
                        </a>
                      </Link>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {loading && (
              <div className="uk-height-small uk-flex uk-flex-center uk-flex-middle">
                <div data-uk-spinner="" />
              </div>
            )}
            {!loading && !allLoaded && (
              <div
                style={{ borderTop: '1px solid #e5e5e5' }}
                className="uk-text-center uk-width-1-1 uk-padding"
              >
                <Button
                  style="text"
                  onClick={() => fetchData()}
                >
                  Voir plus...
                </Button>
              </div>
            )}
            {!loading && allLoaded && members.length <= 0 && (
              <div className="uk-height-small uk-flex uk-flex-center uk-flex-middle">
                <p className="uk-text-italic">Aucun membre trouvé</p>
              </div>
            )}
          </>
        )}
      </Section>
    </LayoutBackOffice>
  );
};
MembersAdmin.getInitialProps = ({ query }) => {
  return { query };
};
MembersAdmin.propTypes = {
  query: PropTypes.shape({ role: PropTypes.string }).isRequired,
};
export default MembersAdmin;
