import {
  OFFER_ADMIN_FILTERS_DATA,
  OPPORTUNITY_FILTERS_DATA,
} from 'src/constants';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from 'src/components/store/UserProvider';
import { useFilters } from 'src/hooks';
import { ADMIN_ZONES, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import { Section } from 'src/components/utils';
import AdminOpportunityList from 'src/components/backoffice/admin/AdminOpportunityList';
import { useRouter } from 'next/router';

const LesOpportunites = () => {
  const {
    push,
    replace,
    query: { offerId, tag, ...restParams },
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

  useEffect(() => {
    if (user) {
      if (!tag) {
        const params = { tag: OFFER_ADMIN_FILTERS_DATA[1].tag, ...restParams };

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
  }, [offerId, push, replace, restParams, tag, user]);

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
          />
        )}
      </Section>
    </LayoutBackOffice>
  );
};

export default LesOpportunites;
