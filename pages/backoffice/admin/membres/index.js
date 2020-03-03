/* global UIkit */
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LayoutBackOffice from '../../../../components/backoffice/LayoutBackOffice';
import { Section, GridNoSSR } from '../../../../components/utils';
import HeaderBackoffice from '../../../../components/headers/HeaderBackoffice';
import axios from '../../../../Axios';
import ModalEdit from '../../../../components/modals/ModalEdit';
import schemaCreateUser from '../../../../components/forms/schema/formCreateUser';

function translateStatusCV(status) {
  if (status === 'Pending') {
    return <span className="uk-text-warning">En attente</span>;
  }
  if (status === 'Published') {
    return <span className="uk-text-success">Publié</span>;
  }
  if (status === 'New') {
    return <span className="uk-text-info">Nouveau</span>;
  }
  return <span className="uk-text-">Inconnu</span>;
}

const MembersAdmin = () => {
  const [members, setMembers] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allLoaded, setAllLoaded] = useState(false);
  const [offset, setOffset] = useState(0);
  const LIMIT = 10;
  const router = useRouter();
  const {
    query: { role },
  } = router;

  const fetchData = async (doReset, query) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.SERVER_URL}/api/v1/user/members`,
        {
          params: {
            limit: LIMIT,
            offset: doReset ? 0 : offset,
            role,
            query,
          },
        }
      );
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
          description="Ici tu peux accéder à tous les profils des coachs et candidats afin d'effectuer un suivi individuel de leur avancée."
        >
          <button
            type="button"
            className="uk-button uk-button-primary"
            style={{
              color: 'white',
              backgroundColor: '#F55F24',
              backgroundImage: 'none',
              textTransform: 'none',
              boder: null,
              padding: '0px 20px',
              borderRadius: '2px',
            }}
            onClick={() => {
              UIkit.modal('#add-user').show();
            }}
          >
            <span
              uk-icon="icon: plus; ratio:0.8"
              className="uk-margin-small-right"
            />
            Nouveau membre
          </button>
          <ModalEdit
            id="add-user"
            formSchema={schemaCreateUser}
            title="Création de membre"
            description="Merci de renseigner quelques informations afin de créer le membre"
            submitText="Créer le membre"
            onSubmit={async (fields) => {
              try {
                const { data } = await axios.post('api/v1/user', fields);
                if (data) {
                  UIkit.notification('Le membre a bien été créé', 'success');
                  fetchData(true);
                } else {
                  throw new Error('réponse de la requete vide');
                }
              } catch (error) {
                console.error(error);
                UIkit.notification(
                  "Une erreur c'est produite lors de la création du membre",
                  'danger'
                );
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
              <ul className="uk-subnav" data-uk-switcher>
                <li
                  className={
                    role !== 'Candidat' && role !== 'Coach' ? 'uk-active' : ''
                  }
                >
                  <a
                    href="#"
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
                <li className={role === 'Candidat' ? 'uk-active' : ''}>
                  <a
                    href="#"
                    onClick={() =>
                      router.push({
                        pathname: '/backoffice/admin/membres',
                        query: { role: 'Candidat' },
                      })
                    }
                  >
                    Candidats
                  </a>
                </li>
                <li className={role === 'Coach' ? 'uk-active' : ''}>
                  <a
                    href="#"
                    onClick={() =>
                      router.push({
                        pathname: '/backoffice/admin/membres',
                        query: { role: 'Coach' },
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
                    {role === 'Candidat' && (
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
                    <Link
                      key={key}
                      href={`/backoffice/admin/membres/${member.id}`}
                    >
                      <tr
                        className="uk-text-reset"
                        aria-hidden="true"
                        style={{ cursor: 'pointer' }}
                      >
                        <td>
                          <GridNoSSR row gap="small" middle>
                            <img
                              className="uk-preserve-width uk-border-circle"
                              src="/static/img/arthur.png"
                              width="48"
                              style={{ height: '48px' }}
                              alt={`${member.firsName} profil`}
                            />
                            <GridNoSSR column gap="collapse">
                              <span className="uk-text-bold">
                                {member.firstName} {member.lastName}
                              </span>
                              <span>{member.email}</span>
                            </GridNoSSR>
                          </GridNoSSR>
                        </td>
                        {role === 'All' && <td>{member.role}</td>}
                        {role === 'Candidat' && (
                          <>
                            <td>
                              <span className="uk-hidden@s">
                                {!member.employed
                                  ? "En recherche d'emploi"
                                  : 'A trouvé un emploi'}
                              </span>
                              <input
                                className="uk-checkbox uk-visible@s"
                                type="checkbox"
                                defaultChecked={member.employed}
                              />
                            </td>
                            <td>
                              {member.cvs && member.cvs.length > 0 ? (
                                translateStatusCV(member.cvs[0].status)
                              ) : (
                                <span className="uk-text-italic uk-text-danger">
                                  Aucun CV
                                </span>
                              )}
                            </td>
                            <td>
                              <span className="uk-hidden@s">
                                {member.hidden ? 'Masqué' : 'Visible'}
                              </span>
                              <input
                                className="uk-checkbox uk-visible@s"
                                type="checkbox"
                                defaultChecked={member.hidden}
                              />
                            </td>
                          </>
                        )}
                        <td>
                          {member.linkedUser ? (
                            `${member.linkedUser.firstName} ${member.linkedUser.lastName}`
                          ) : (
                            <span className="uk-text-italic">Non lié</span>
                          )}
                        </td>
                        <td>
                          {member.lastConnection ? (
                            moment(member.lastConnection).format('DD/MM/YYYY')
                          ) : (
                            <span className="uk-text-italic">
                              Aucune connexion
                            </span>
                          )}
                        </td>
                      </tr>
                    </Link>
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
                <button
                  className="uk-button uk-button-text"
                  type="button"
                  onClick={() => fetchData()}
                >
                  Voir plus...
                </button>
              </div>
            )}
            {!loading && allLoaded && members.length <= 0 && (
              <div className="uk-height-small uk-flex uk-flex-center uk-flex-middle">
                <p className="uk-text-italic">Aucuns membres trouvé</p>
              </div>
            )}
          </>
        )}
      </Section>
    </LayoutBackOffice>
  );
};
export default MembersAdmin;
