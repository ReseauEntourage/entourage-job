import {
  OFFER_ADMIN_FILTERS_DATA,
  OPPORTUNITY_FILTERS_DATA,
  USER_ROLES,
} from 'src/constants';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from 'src/components/store/UserProvider';
import { useFilters, useTabFilters } from 'src/hooks';
import { ADMIN_ZONES, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import { Section } from 'src/components/utils';
import AdminOpportunityList from 'src/components/backoffice/admin/AdminOpportunityList';
import { useRouter } from 'next/router';

const LesOpportunites = () => {
  const {
    isReady,
    replace,
    query: { q, offerId, tag, ...restParams },
  } = useRouter();

  const { user } = useContext(UserContext);
  const [loadingDefaultFilters, setLoadingDefaultFilters] = useState(true);

  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    OPPORTUNITY_FILTERS_DATA,
    {
      href: '/backoffice/admin/offres',
    },
    ['offerId']
  );

  const { tabFilters, setTabFilters } = useTabFilters(
    OFFER_ADMIN_FILTERS_DATA,
    {
      href: '/backoffice/admin/offres',
    },
    ['offerId']
  );

  useEffect(() => {
    if (isReady) {
      const redirectParams = tag
        ? {
            tag,
            ...restParams,
          }
        : restParams;

      // For retrocompatibility
      if (q) {
        replace(
          {
            pathname: '/backoffice/admin/offres/[offerId]',
            query: redirectParams,
          },
          {
            pathname: `/backoffice/admin/offres/${q}`,
            query: redirectParams,
          },
          {
            shallow: true,
          }
        );
      } else if (user) {
        if (user.role !== USER_ROLES.ADMIN) {
          replace(
            {
              pathname: `/backoffice/candidat/offres${
                offerId ? '/[offerId]' : ''
              }`,
              query: redirectParams,
            },
            {
              pathname: `/backoffice/candidat/offres${
                offerId ? `/${offerId}` : ''
              }`,
              query: redirectParams,
            },
            {
              shallow: true,
            }
          );
        } else if (!tag) {
          const params = {
            tag: OFFER_ADMIN_FILTERS_DATA[1].tag,
            ...restParams,
          };

          if (user.zone && user.zone !== ADMIN_ZONES.HZ) {
            const defaultDepartmentsForAdmin = DEPARTMENTS_FILTERS.filter(
              (dept) => {
                return user.zone === dept.zone;
              }
            );

            params.department = defaultDepartmentsForAdmin.map((dept) => {
              return dept.value;
            });
          }
          if (offerId) {
            replace(
              {
                pathname: '/backoffice/admin/offres/[offerId]',
                query: params,
              },
              {
                pathname: `/backoffice/admin/offres/${offerId}`,
                query: params,
              },
              {
                shallow: true,
              }
            );
          } else {
            replace(
              {
                pathname: '/backoffice/admin/offres',
                query: params,
              },
              undefined,
              {
                shallow: true,
              }
            );
          }
        } else {
          setLoadingDefaultFilters(false);
        }
      }
    }
  }, [q, offerId, replace, restParams, tag, user, isReady]);

  return (
    <LayoutBackOffice title="Modération des offres d'emploi">
      <Section>
        {!user || loadingDefaultFilters ? (
          <div className="uk-text-center">
            <div data-uk-spinner />
          </div>
        ) : (
          <AdminOpportunityList
            search={search}
            filters={filters}
            resetFilters={resetFilters}
            setSearch={setSearch}
            setFilters={setFilters}
            tabFilters={tabFilters}
            setTabFilters={setTabFilters}
          />
        )}
      </Section>
    </LayoutBackOffice>
  );
};

export default LesOpportunites;
