/* global UIkit */

import { CV_STATUS, USER_ROLES } from 'src/constants';
import { Grid, Section, SimpleLink } from 'src/components/utils';
import ImgProfile from 'src/components/headers/ImgProfile';
import _ from 'lodash';
import moment from 'moment';
import { IconNoSSR } from 'src/components/utils/Icon';
import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import useDeepCompareEffect from 'use-deep-compare-effect';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import Button from 'src/components/utils/Button';
import ModalEdit from 'src/components/modals/ModalEdit';
import Api from 'src/Axios';
import SearchBar from 'src/components/filters/SearchBar';
import { filtersToQueryParams, mutateFormSchema } from 'src/utils';
import schemaCreateUser from 'src/components/forms/schema/formEditUser';
import { openModal } from 'src/components/modals/Modal';

const translateStatusCV = (status) => {
  const cvStatus = CV_STATUS[status] ? CV_STATUS[status] : CV_STATUS.Unknown;
  return <span className={`uk-text-${cvStatus.style}`}>{cvStatus.label}</span>;
};

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

const LIMIT = 50;

const MemberPropTypes = PropTypes.shape({
  id: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  lastConnection: PropTypes.string,
  role: PropTypes.string,
  zone: PropTypes.string,
});

const Member = ({ member, role }) => {
  const { push } = useRouter();
  return (
    <tr
      className="uk-link-reset"
      style={{ cursor: 'pointer' }}
      onClick={() => {
        return push(
          '/backoffice/admin/membres/[memberId]',
          `/backoffice/admin/membres/${member.id}`
        );
      }}
    >
      <td>
        <Grid row gap="small" middle className="uk-hidden@m" center>
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
          style={{ marginBottom: 15 }}
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
            <span className="uk-text-italic">Zone non renseignée</span>
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
          <span className="uk-text-italic">Aucune connexion</span>
        )}
      </td>
      {role !== USER_ROLES.COACH && (
        <>
          <td className="uk-text-center">
            {member.role === USER_ROLES.CANDIDAT ? (
              getCandidateFromCoachOrCandidate(member) && (
                <>
                  <span className="uk-hidden@m">
                    {getCandidateFromCoachOrCandidate(member).employed
                      ? 'A trouvé un emploi'
                      : "En recherche d'emploi"}
                  </span>
                  {getCandidateFromCoachOrCandidate(member).employed && (
                    <IconNoSSR
                      name="check"
                      ratio={1.2}
                      className="uk-text-primary uk-visible@m"
                    />
                  )}
                </>
              )
            ) : (
              <span>-</span>
            )}
          </td>
          <td className="uk-text-center">
            {member.role === USER_ROLES.CANDIDAT ? (
              <div>
                {getCandidateFromCoachOrCandidate(member) &&
                getCandidateFromCoachOrCandidate(member).cvs &&
                getCandidateFromCoachOrCandidate(member).cvs.length > 0 ? (
                  translateStatusCV(
                    getCandidateFromCoachOrCandidate(member).cvs[0].status
                  )
                ) : (
                  <span className="uk-text-italic uk-text-info">Aucun CV</span>
                )}
              </div>
            ) : (
              <span>-</span>
            )}
          </td>
          <td className="uk-text-center">
            {member.role === USER_ROLES.CANDIDAT ? (
              getCandidateFromCoachOrCandidate(member) && (
                <>
                  <span className="uk-hidden@m">
                    {getCandidateFromCoachOrCandidate(member).hidden
                      ? 'Masqué'
                      : 'Visible'}
                  </span>
                  {getCandidateFromCoachOrCandidate(member).hidden && (
                    <IconNoSSR
                      name="check"
                      ratio={1.2}
                      className="uk-text-primary uk-visible@m"
                    />
                  )}
                </>
              )
            ) : (
              <span>-</span>
            )}
          </td>
        </>
      )}
    </tr>
  );
};

Member.propTypes = {
  member: MemberPropTypes.isRequired,
  role: PropTypes.oneOf(['All', USER_ROLES.CANDIDAT, USER_ROLES.COACH]),
};

Member.defaultProps = {
  role: 'All',
};

const MemberList = ({
  filtersConst,
  search,
  filters,
  setFilters,
  setSearch,
  resetFilters,
}) => {
  const [numberOfResults, setNumberOfResults] = useState(0);

  const [members, setMembers] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allLoaded, setAllLoaded] = useState(false);
  const [offset, setOffset] = useState(0);

  const {
    query: { role, ...restParams },
  } = useRouter();

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
    (searchValue, filtersValue, roleValue, offsetValue, doReset) => {
      setHasError(false);
      if (doReset) {
        setLoading(true);
        setMembers([]);
      }
      Api.get('/api/v1/user/members', {
        params: {
          limit: LIMIT,
          offset: doReset ? 0 : offsetValue,
          role: roleValue,
          query: searchValue,
          ...filtersToQueryParams(filtersValue),
        },
      })
        .then(({ data }) => {
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
        })
        .catch((err) => {
          console.error(err);
          setHasError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    []
  );

  useDeepCompareEffect(() => {
    fetchData(search, filters, role, offset, true);
  }, [search, filters, role]);

  return (
    <>
      <HeaderBackoffice
        title="Gestion des membres"
        description="Ici vous pouvez accéder à tous les profils des coachs et candidats afin d'effectuer un suivi individuel de leur avancée."
      >
        <Button
          style="primary"
          onClick={() => {
            openModal(
              <ModalEdit
                formSchema={mutatedSchema}
                title="Création de membre"
                description="Merci de renseigner quelques informations afin de créer le membre"
                submitText="Créer le membre"
                onSubmit={async (fields, closeModal) => {
                  try {
                    const { data } = await Api.post('api/v1/user', {
                      ...fields,
                      adminRole:
                        fields.role === USER_ROLES.ADMIN
                          ? fields.adminRole
                          : null,
                    });
                    if (data) {
                      closeModal();
                      UIkit.notification(
                        'Le membre a bien été créé',
                        'success'
                      );
                      await fetchData(search, filters, role, offset, true);
                    } else {
                      UIkit.notification(
                        "Une erreur s'est produite lors de la création du membre",
                        'danger'
                      );
                    }
                  } catch (error) {
                    console.error(error);
                    if (error?.response?.status === 409) {
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
            );
          }}
        >
          <IconNoSSR
            name="plus"
            ratio={0.8}
            className="uk-margin-small-right"
          />
          Nouveau membre
        </Button>
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
                <span className="uk-text-primary">l&apos;équipe LinkedOut</span>{' '}
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
                <SimpleLink
                  shallow
                  href={{
                    pathname: '/backoffice/admin/membres',
                    query: {
                      role: 'All',
                      ...restParams,
                    },
                  }}
                >
                  Tous les membres
                </SimpleLink>
              </li>
              <li className={role === USER_ROLES.CANDIDAT ? 'uk-active' : ''}>
                <SimpleLink
                  shallow
                  href={{
                    pathname: '/backoffice/admin/membres',
                    query: {
                      role: USER_ROLES.CANDIDAT,
                      ...restParams,
                    },
                  }}
                >
                  Candidats
                </SimpleLink>
              </li>
              <li className={role === USER_ROLES.COACH ? 'uk-active' : ''}>
                <SimpleLink
                  shallow
                  href={{
                    pathname: '/backoffice/admin/membres',
                    query: {
                      role: USER_ROLES.COACH,
                      ...restParams,
                    },
                  }}
                >
                  Coachs
                </SimpleLink>
              </li>
            </ul>
          </Grid>
          <SearchBar
            filtersConstants={filtersConst}
            filters={filters}
            numberOfResults={numberOfResults}
            resetFilters={resetFilters}
            search={search}
            setSearch={setSearch}
            setFilters={setFilters}
            placeholder="Rechercher..."
          />
          {loading ? (
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
                      <th className="uk-text-center">Coach/candidat associé</th>
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
                        <th className="uk-text-center">A retrouvé un emploi</th>
                        <th className="uk-text-center">Statut du CV</th>
                        <th className="uk-text-center">CV masqué</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, key) => {
                    return <Member role={role} member={member} key={key} />;
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
                  await fetchData(search, filters, role, offset, false);
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
    </>
  );
};

MemberList.propTypes = {
  search: PropTypes.string,
  filters: PropTypes.shape(),
  filtersConst: PropTypes.arrayOf(PropTypes.shape()),
  setFilters: PropTypes.func,
  setSearch: PropTypes.func,
  resetFilters: PropTypes.func,
};

MemberList.defaultProps = {
  search: undefined,
  filters: {},
  filtersConst: {},
  setFilters: () => {},
  setSearch: () => {},
  resetFilters: () => {},
};

export default MemberList;
