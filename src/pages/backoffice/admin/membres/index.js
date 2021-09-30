/* global UIkit */
import moment from 'moment';
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import { PropTypes } from 'prop-types';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import { Section, Grid, Icon } from 'src/components/utils';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import Api from 'src/Axios';
import ModalEdit from 'src/components/modals/ModalEdit';
import schemaCreateUser from 'src/components/forms/schema/formEditUser';
import ImgProfile from 'src/components/headers/ImgProfile';
import {
  MEMBER_FILTERS_DATA,
  CV_STATUS,
  USER_ROLES,
  STORAGE_KEYS,
} from 'src/constants';
import Button from 'src/components/utils/Button';
import {
  filtersToQueryParams,
  initializeFilters,
  mutateFormSchema,
} from 'src/utils';
import { usePrevious } from 'src/hooks/utils';
import _ from 'lodash';
import { useFilters } from 'src/hooks';
import { UserContext } from 'src/components/store/UserProvider';
import { ADMIN_ZONES_FILTERS } from 'src/constants/departements';
import SearchBar from 'src/components/filters/SearchBar';
import { DataContext } from 'src/components/store/DataProvider';

function translateStatusCV(status) {
  const cvStatus = CV_STATUS[status] ? CV_STATUS[status] : CV_STATUS.Unknown;
  return <span className={`uk-text-${cvStatus.style}`}>{cvStatus.label}</span>;
}
const LIMIT = 50;

const getRelatedUser = (member) => {
  if (member.candidat && member.candidat.coach) {
    return member.candidat.coach;
  }
  if (member.coach && member.coach.candidat) {
    return member.coach.candidat;
  }
  return null;
};

const getCandidateFromCoachOrCandidate = (member) => {
  if (member.role === USER_ROLES.CANDIDAT) {
    return member.candidat;
  }

  return member.coach;
};

const MembersAdmin = ({ query: { role = 'All' } }) => {
  const { user } = useContext(UserContext);
  const [loadingDefaultFilters, setLoadingDefaultFilters] = useState(true);
  const prevUser = usePrevious(user);

  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState();
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allLoaded, setAllLoaded] = useState(false);
  const [offset, setOffset] = useState(0);
  const [filtersConst, setFiltersConst] = useState(MEMBER_FILTERS_DATA);
  const prevSearchQuery = usePrevious(searchQuery);
  const prevRole = usePrevious(role);
  const router = useRouter();

  const { getData, storeData } = useContext(DataContext);

  const {
    filters,
    setFilters,
    numberOfResults,
    setNumberOfResults,
    resetFilters,
  } = useFilters(filtersConst);

  useEffect(() => {
    if (!loadingDefaultFilters) {
      storeData(STORAGE_KEYS.MEMBERS_FILTERS, filters);
    }
  }, [filters, loadingDefaultFilters, storeData]);

  useEffect(() => {
    if (user) {
      const initialFiltersConst =
        role === USER_ROLES.COACH
          ? MEMBER_FILTERS_DATA.slice(0, 2)
          : MEMBER_FILTERS_DATA;
      if (user !== prevUser) {
        if (user.zone) {
          const defaultZoneForAdmin = ADMIN_ZONES_FILTERS.filter(
            (adminZone) => {
              return adminZone.value === user.zone;
            }
          );
          setFilters(
            initializeFilters(initialFiltersConst, {
              [MEMBER_FILTERS_DATA[0].key]: [...defaultZoneForAdmin],
            })
          );
        } else {
          setFilters(initializeFilters(initialFiltersConst));
        }
        setFiltersConst(initialFiltersConst);
        setLoadingDefaultFilters(false);
      } else if (!loadingDefaultFilters && role !== prevRole) {
        if (role === USER_ROLES.COACH) {
          setFilters((prevFilters) => {
            return {
              [MEMBER_FILTERS_DATA[0].key]:
                prevFilters[MEMBER_FILTERS_DATA[0].key],
              [MEMBER_FILTERS_DATA[1].key]:
                prevFilters[MEMBER_FILTERS_DATA[1].key],
            };
          });
        } else {
          setFilters((prevFilters) => {
            return initializeFilters(MEMBER_FILTERS_DATA, prevFilters);
          });
        }
        setFiltersConst(initialFiltersConst);
      }
    }
  }, [
    getData,
    loadingDefaultFilters,
    prevRole,
    prevUser,
    role,
    setFilters,
    user,
  ]);

  const prevFilters = usePrevious(filters);
  const prevLoadingDefaultFilters = usePrevious(loadingDefaultFilters);

  const mutatedSchema = mutateFormSchema(schemaCreateUser, [
    {
      fieldId: 'role',
      props: [
        {
          propName: 'hidden',
          value: false,
          option: USER_ROLES.ADMIN,
        },
      ],
    },
  ]);

  const fetchData = useCallback(
    async (doReset) => {
      setHasError(false);
      if (doReset) {
        setLoading(true);
        setMembers([]);
      }
      try {
        const { data } = await Api.get('/api/v1/user/members', {
          params: {
            limit: LIMIT,
            offset: doReset ? 0 : offset,
            role,
            query: searchQuery,
            ...filtersToQueryParams(filters),
          },
        });
        if (doReset) {
          setMembers(data);
          setNumberOfResults(data.length);
          setOffset(LIMIT);
          setAllLoaded(false);
        } else {
          setMembers((prevMembers) => {
            return [...prevMembers, ...data];
          });
          setOffset((prevOffset) => {
            return prevOffset + LIMIT;
          });
          setNumberOfResults((prevNumberOfResults) => {
            return prevNumberOfResults + data.length;
          });
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
    },
    [filters, offset, role, searchQuery, setNumberOfResults]
  );

  useEffect(() => {
    if (
      !loadingDefaultFilters &&
      (loadingDefaultFilters !== prevLoadingDefaultFilters ||
        filters !== prevFilters ||
        prevSearchQuery !== searchQuery)
    ) {
      fetchData(true);
    }
  }, [
    fetchData,
    filters,
    loadingDefaultFilters,
    prevFilters,
    prevLoadingDefaultFilters,
    prevSearchQuery,
    searchQuery,
  ]);

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
            formSchema={mutatedSchema}
            title="Création de membre"
            description="Merci de renseigner quelques informations afin de créer le membre"
            submitText="Créer le membre"
            onSubmit={async (fields, closeModal) => {
              try {
                const { data } = await Api.post('api/v1/user', fields);
                if (data) {
                  closeModal();
                  UIkit.notification('Le membre a bien été créé', 'success');
                  await fetchData();
                } else {
                  throw new Error('réponse de la requete vide');
                }
              } catch (error) {
                console.error(error);
                if (error.response.status === 409) {
                  UIkit.notification(
                    'Cette adresse email est déjà utilisée',
                    'danger'
                  );
                } else {
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
            <Grid eachWidths={['expand', 'auto']}>
              <ul className="uk-subnav ent-subnav">
                <li
                  className={
                    role !== USER_ROLES.CANDIDAT && role !== USER_ROLES.COACH
                      ? 'uk-active'
                      : ''
                  }
                >
                  <a
                    aria-hidden="true"
                    onClick={() => {
                      return router.push({
                        pathname: '/backoffice/admin/membres',
                        query: { role: 'All' },
                      });
                    }}
                  >
                    Tous les membres
                  </a>
                </li>
                <li className={role === USER_ROLES.CANDIDAT ? 'uk-active' : ''}>
                  <a
                    aria-hidden="true"
                    onClick={() => {
                      return router.push({
                        pathname: '/backoffice/admin/membres',
                        query: { role: USER_ROLES.CANDIDAT },
                      });
                    }}
                  >
                    Candidats
                  </a>
                </li>
                <li className={role === USER_ROLES.COACH ? 'uk-active' : ''}>
                  <a
                    aria-hidden="true"
                    onClick={() => {
                      return router.push({
                        pathname: '/backoffice/admin/membres',
                        query: { role: USER_ROLES.COACH },
                      });
                    }}
                  >
                    Coachs
                  </a>
                </li>
              </ul>
            </Grid>
            {!loadingDefaultFilters && (
              <SearchBar
                filtersConstants={filtersConst}
                filters={filters}
                numberOfResults={numberOfResults}
                resetFilters={resetFilters}
                search={searchQuery}
                setSearch={setSearchQuery}
                setFilters={setFilters}
                placeholder="Rechercher..."
              />
            )}
            {loading || loadingDefaultFilters ? (
              <div className="uk-height-small uk-flex uk-flex-center uk-flex-middle">
                <div data-uk-spinner="" />
              </div>
            ) : (
              <div className="uk-overflow-auto uk-margin-top">
                <table className="uk-table uk-table-hover uk-table-middle uk-table-divider uk-table-responsive">
                  <thead>
                    <tr>
                      <th className="uk-text-nowrap">Membre</th>
                      <th className="uk-text-center">Zone</th>
                      {role === 'All' && (
                        <th className="uk-text-center">
                          Coach/candidat associé
                        </th>
                      )}
                      {role === USER_ROLES.CANDIDAT && (
                        <th className="uk-text-center">Coach associé</th>
                      )}
                      {role === USER_ROLES.COACH && (
                        <th className="uk-text-center">Candidat associé</th>
                      )}
                      <th className="uk-text-center">Dernière connexion</th>
                      {role !== USER_ROLES.COACH && (
                        <>
                          <th className="uk-text-center">
                            A retrouvé un emploi
                          </th>
                          <th className="uk-text-center">Statut du CV</th>
                          <th className="uk-text-center">CV masqué</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member, key) => {
                      return (
                        <tr
                          key={key}
                          className="uk-link-reset"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            return router.push(
                              '/backoffice/admin/membres/[id]',
                              `/backoffice/admin/membres/${member.id}`
                            );
                          }}
                        >
                          <td>
                            <Grid
                              row
                              gap="small"
                              middle
                              className="uk-hidden@m"
                              center
                            >
                              <ImgProfile user={member} size={48} />
                              <Grid column gap="collapse">
                                <span className="uk-text-bold">
                                  {member.firstName} {member.lastName}
                                </span>
                                <span>{member.email}</span>
                              </Grid>
                            </Grid>
                            <Grid
                              row
                              gap="small"
                              middle
                              className="uk-visible@m"
                            >
                              <ImgProfile user={member} size={48} />
                              <Grid column gap="collapse">
                                <span className="uk-text-bold">
                                  {member.firstName} {member.lastName}
                                </span>
                                <span>{member.email}</span>
                              </Grid>
                            </Grid>
                          </td>
                          <td className="uk-text-center">
                            <span className="uk-label uk-text-nowrap uk-visible@m">
                              {member.zone && _.capitalize(member.zone)}
                            </span>
                            <div className="uk-hidden@m">
                              {member.zone ? (
                                <span className="uk-label uk-text-nowrap">
                                  {_.capitalize(member.zone)}
                                </span>
                              ) : (
                                <span className="uk-text-italic">
                                  Zone non renseignée
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="uk-text-center">
                            {role === 'All' && (
                              <span className="uk-text-bold">
                                {member.role} de
                                <br />
                              </span>
                            )}
                            {getRelatedUser(member) ? (
                              `${getRelatedUser(member).firstName} ${
                                getRelatedUser(member).lastName
                              }`
                            ) : (
                              <span className="uk-text-italic">Non lié</span>
                            )}
                          </td>
                          <td className="uk-text-center">
                            {member.lastConnection ? (
                              moment(member.lastConnection).format('DD/MM/YYYY')
                            ) : (
                              <span className="uk-text-italic">
                                Aucune connexion
                              </span>
                            )}
                          </td>
                          {role !== USER_ROLES.COACH && (
                            <>
                              <td className="uk-text-center">
                                {member.role === USER_ROLES.CANDIDAT ? (
                                  <>
                                    {getCandidateFromCoachOrCandidate(
                                      member
                                    ) && (
                                      <>
                                        <span className="uk-hidden@m">
                                          {getCandidateFromCoachOrCandidate(
                                            member
                                          ).employed
                                            ? 'A trouvé un emploi'
                                            : "En recherche d'emploi"}
                                        </span>
                                        {getCandidateFromCoachOrCandidate(
                                          member
                                        ).employed && (
                                          <Icon
                                            name="check"
                                            ratio={1.2}
                                            className="uk-text-primary uk-visible@m"
                                          />
                                        )}
                                      </>
                                    )}
                                  </>
                                ) : (
                                  <span>-</span>
                                )}
                              </td>
                              <td className="uk-text-center">
                                {member.role === USER_ROLES.CANDIDAT ? (
                                  <>
                                    {getCandidateFromCoachOrCandidate(member) &&
                                    getCandidateFromCoachOrCandidate(member)
                                      .cvs &&
                                    getCandidateFromCoachOrCandidate(member).cvs
                                      .length > 0 ? (
                                      translateStatusCV(
                                        getCandidateFromCoachOrCandidate(member)
                                          .cvs[0].status
                                      )
                                    ) : (
                                      <span className="uk-text-italic uk-text-info">
                                        Aucun CV
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <span>-</span>
                                )}
                              </td>
                              <td className="uk-text-center">
                                {member.role === USER_ROLES.CANDIDAT ? (
                                  <>
                                    {getCandidateFromCoachOrCandidate(
                                      member
                                    ) && (
                                      <>
                                        <span className="uk-hidden@m">
                                          {getCandidateFromCoachOrCandidate(
                                            member
                                          ).hidden
                                            ? 'Masqué'
                                            : 'Visible'}
                                        </span>
                                        {getCandidateFromCoachOrCandidate(
                                          member
                                        ).hidden && (
                                          <Icon
                                            name="check"
                                            ratio={1.2}
                                            className="uk-text-primary uk-visible@m"
                                          />
                                        )}
                                      </>
                                    )}
                                  </>
                                ) : (
                                  <span>-</span>
                                )}
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && !allLoaded && (
              <div
                style={{ borderTop: '1px solid #e5e5e5' }}
                className="uk-text-center uk-width-1-1 uk-padding"
              >
                <Button
                  style="text"
                  onClick={async () => {
                    await fetchData(false);
                  }}
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
